import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import ChildrenComments from '../components/ChildrenComments';
import Comment from '../components/Comment';

const CommentContainer = ({ comments, users, location }) => {
  const { id } = queryString.parse(location.search);
  const comment = comments[id];

  return (
    <Comment
      replies={comment.replies}
      id={comment.id}
      content={comment.text}
      user={users[comment.createdBy].name}
      date={new Date(comment.createdAt)}
      showReply
      getChilrenCallback={args => ChildrenComments(args, comments, users)}
    />
  );
};

const mapStateToProps = ({ users, comments }) => ({
  users,
  comments
});

export default connect(mapStateToProps)(CommentContainer);
