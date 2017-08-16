import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import queryString from 'query-string';
import actions from '../actions/comments';
import Comment from '../components/Comment';
import '../styles/reply.css';

class Reply extends Component {
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
        <div className="reply">
          <div className="reply__content">
            <Comment
              showReply={false}
              id={comment.id}
              content={comment.text}
              user={users[comment.createdBy].name}
              date={new Date(comment.createdAt)}
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

const mapDispatchToProps = dispatch => {
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
};

const mapStateToProps = state => {
  return {
    comments: state.comments,
    users: state.users,
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reply);
