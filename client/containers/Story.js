import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import queryString from 'query-string';
import Item from '../components/Item';
import actions from '../actions/comments';
import Comment from '../components/Comment';
import ChildrenComments from '../components/ChildrenComments';
import getCommentsCount from '../helpers/getCommentsCount';

class Story extends Component {
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
    const story = this.props.news[id];
    const userName = this.props.users[story.userId].name;
    const link = story.type === 'ask' ? `/story?id=${id}` : story.link;

    return (
      <div className="Item">
        <Item
          id={id}
          title={story.title}
          link={link}
          date={new Date(story.createDate)}
          score={story.voted.length}
          user={userName}
          commentCount={getCommentsCount(this.props.comments, story.comments)}
        />
        <div className="Item__content">
          <div className="Item__title">
            {story.text}
          </div>
          <div className="Item__textarea">
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
        <div className="Item__kids">
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
    news: state.news,
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

export default connect(mapStateToProps, mapDispatchToProps)(Story);
