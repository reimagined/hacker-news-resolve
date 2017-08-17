import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import queryString from 'query-string';
import Story from '../components/Story';
import actions from '../actions/comments';
import Comment from '../components/Comment';
import ChildrenComments from '../components/ChildrenComments';
import getCommentsCount from '../helpers/getCommentsCount';
import '../styles/storyDetails.css';

class StoryDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

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
    const userName = this.props.users[story.userId].name;
    const link = story.type === 'ask' ? `/storyDetails?id=${id}` : story.link;

    return (
      <div className="storyDetails">
        <Story
          id={id}
          title={story.title}
          link={link}
          date={new Date(story.createDate)}
          score={story.voted.length}
          user={userName}
          commentCount={getCommentsCount(this.props.comments, story.comments)}
        />
        <div className="storyDetails__content">
          <div className="storyDetails__title">
            {story.text}
          </div>
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
              Add comment
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

const mapStateToProps = state => {
  return {
    stories: state.stories,
    users: state.users,
    comments: state.comments,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddComment({ parentId, text, userId }) {
      return dispatch(
        actions.createComment(uuid.v4(), {
          text,
          parentId,
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoryDetails);
