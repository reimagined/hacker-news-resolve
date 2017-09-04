import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import actions from '../actions/stories';
import Comment from '../components/Comment';
import subscribe from '../decorators/subscribe';
import comments from '../../common/read-models/comments';
import '../styles/reply.css';

export class Reply extends Component {
  state = {
    text: ''
  };

  onReply(parentId, userId, storyId) {
    this.props.onReply({
      text: this.state.text,
      parentId,
      userId,
      storyId
    });
    // eslint-disable-next-line no-restricted-globals
    history.back();
  }

  render() {
    const { comments, users, user, id } = this.props;
    const comment = comments.find(c => c.id === id);
    const userName = users.find(({ id }) => id === comment.createdBy).name;

    return (
      <div>
        <div className="reply">
          <div className="reply__content">
            <Comment
              showReply={false}
              id={comment.id}
              content={comment.text}
              user={userName}
              date={new Date(+comment.createdAt)}
            />
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
            />
            <div>
              <button
                onClick={() => this.onReply(id, user.id, comment.storyId)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onReply({ parentId, text, userId, storyId }) {
      return dispatch(
        actions.createComment(storyId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        })
      );
    }
  };
};

const mapStateToProps = (state, { match }) => {
  return {
    comments: state.comments,
    users: state.users,
    user: state.user,
    id: match.params.id
  };
};

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($id: String!) { comments(id: $id) { text, id, parentId, createdAt, createdBy, replies } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(Reply));
