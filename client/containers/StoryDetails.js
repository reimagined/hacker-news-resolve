import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuid from 'uuid';
import sanitizer from 'sanitizer';

import Story from '../components/Story';
import actions from '../actions/stories';
import Comment from '../components/Comment';
import ChildrenComments from '../components/ChildrenComments';
import subscribe from '../decorators/subscribe';
import stories from '../../common/read-models/stories';
import '../styles/storyDetails.css';

export class StoryDetails extends React.PureComponent {
  state = {
    text: ''
  };

  onAddComment = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.id,
      userId: this.props.user.id
    });
    this.setState({ text: '' });
  };

  onChangeText = event =>
    this.setState({
      text: event.target.value
    });

  onUpvote = () => this.props.upvoteStory(this.props.id, this.props.user.id);

  onUnvote = () => this.props.unvoteStory(this.props.id, this.props.user.id);

  render() {
    const { id, stories } = this.props;
    const story = stories.find(story => story.id === id);

    if (!story) {
      return null;
    }

    const link = story.type === 'ask' ? `/storyDetails/${id}` : story.link;

    return (
      <div className="storyDetails">
        <Story
          id={id}
          title={story.title}
          link={link}
          score={story.voted.length}
          voted={story.voted.includes(this.props.user.id)}
          user={{
            id: story.userId,
            name: story.userName
          }}
          date={new Date(+story.createDate)}
          commentCount={story.commentsCount}
          onUpvote={this.onUpvote}
          onUnvote={this.onUnvote}
          loggedIn={!!this.props.user.id}
        />
        {story.text && (
          <div
            className="storyDetails__text"
            dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(story.text) }}
          />
        )}
        <div className="storyDetails__content">
          <div className="storyDetails__textarea">
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={this.onChangeText}
            />
          </div>
          <div>
            <button onClick={this.onAddComment}>add comment</button>
          </div>
        </div>
        <div>
          {story.comments.map(commentId => {
            const comment = this.props.comments.find(
              ({ id }) => id === commentId
            );

            if (!comment) {
              return null;
            }

            return (
              <Comment
                key={commentId}
                id={comment.id}
                content={comment.text}
                user={{
                  id: comment.createdBy,
                  name: comment.createdByName
                }}
                date={new Date(+comment.createdAt)}
                showReply
              >
                <ChildrenComments
                  replies={comment.replies}
                  comments={this.props.comments}
                />
              </Comment>
            );
          })}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = ({ stories, comments, user }, { match }) => ({
  stories,
  comments,
  user,
  id: match.params.id
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createComment: ({ parentId, text, userId }) =>
        actions.createComment(parentId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        }),
      upvoteStory: (id, userId) =>
        actions.upvoteStory(id, {
          userId
        }),
      unvoteStory: (id, userId) =>
        actions.unvoteStory(id, {
          userId
        })
    },
    dispatch
  );

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: stories,
      query:
        'query ($id: ID!) { stories(id: $id) { id, type, title, text, userId, userName, createDate, link, comments, commentsCount, voted } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails));
