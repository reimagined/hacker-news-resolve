import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import queryString from 'query-string';
import actions from '../actions/comments';
import CommentComponent from './CommentComponent';

class ReplyComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  onReply(parentId, userId) {
    this.props.onReply({
      text: this.state.text,
      parentId,
      userId
    });
    // eslint-disable-next-line no-restricted-globals
    history.back();
  }

  render() {
    const { comments, users, user, location } = this.props;
    const { id } = queryString.parse(location.search);
    const comment = comments[id];

    return (
      <div>
        <div className="Item">
          <div className="Item__content">
            <CommentComponent
              showReply={false}
              id={comment.id}
              content={comment.text}
              user={users[comment.createdBy].name}
              date={new Date(comment.createdAt)}
              expanded={10}
            />
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
            />
            <div>
              <button onClick={() => this.onReply(id, user.id)}>Reply</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onReply({ parentId, text, userId }) {
      return dispatch(
        actions.createComment(uuid.v4(), {
          text,
          parentId,
          userId
        })
      );
    }
  };
}

function mapStateToProps(state) {
  return {
    comments: state.comments,
    users: state.users,
    user: state.user
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComponent);
