import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import queryString from 'query-string';
import sanitizer from 'sanitizer';

import Story from '../components/Story';
import actions from '../actions/comments';
import storyActions from '../actions/stories';
import Comment from '../components/Comment';
import ChildrenComments from '../components/ChildrenComments';
import getCommentsCount from '../helpers/getCommentsCount';
import '../styles/storyDetails.css';

export class StoryDetails extends Component {
  state = {
    text: ''
  };

  onAddComment(parentId, userId) {
    this.props.onAddComment({
      text: this.state.text,
      parentId,
      userId
    });
    this.setState({ text: '' });
  }

  render() {
    const { id } = queryString.parse(this.props.location.search);
    const story = this.props.stories[id];
    const user = this.props.users[story.userId];
    const link = story.type === 'ask' ? `/storyDetails?id=${id}` : story.link;

    return (
      <div className="storyDetails">
        <Story
          id={id}
          title={story.title}
          link={link}
          score={story.voted.length}
          voted={story.voted.includes(this.props.user.id)}
          user={user}
          date={new Date(story.createDate)}
          commentCount={getCommentsCount(this.props.comments, story.comments)}
          onUpvote={() => this.props.onUpvote(id, this.props.user.id)}
          onUnvote={() => this.props.onUnvote(id, this.props.user.id)}
          loggedIn={!!this.props.user.id}
        />
        <div
          className="storyDetails__text"
          dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(story.text) }}
        />
        <div className="storyDetails__content">
          <div className="storyDetails__textarea">
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
            />
          </div>
          <div>
            <button onClick={() => this.onAddComment(id, this.props.user.id)}>
              add comment
            </button>
          </div>
        </div>
        <div>
          {story.comments.map(commentId => {
            const comment = this.props.comments[commentId];

            return (
              <Comment
                replies={comment.replies}
                id={comment.id}
                content={comment.text}
                user={this.props.users[comment.createdBy].name}
                date={new Date(comment.createdAt)}
                showReply
                getChilrenCallback={args =>
                  ChildrenComments(args, this.props.comments, this.props.users)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    stories: state.stories,
    users: state.users,
    comments: state.comments,
    user: state.user
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    onAddComment({ parentId, text, userId }) {
      return dispatch(
        actions.createComment(uuid.v4(), {
          text,
          parentId,
          userId
        })
      );
    },
    onUpvote(id, userId) {
      return dispatch(
        storyActions.upvoteStory(id, {
          userId
        })
      );
    },
    onUnvote(id, userId) {
      return dispatch(
        storyActions.unvoteStory(id, {
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoryDetails);
