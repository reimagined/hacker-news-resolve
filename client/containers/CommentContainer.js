import React from 'react';
import { connect } from 'react-redux';
import ChildrenComments from '../components/ChildrenComments';
import CommentComponent from '../components/CommentComponent';

function CommentContainer({ comments, users, location }) {
  const commentId = location.pathname.split('=')[1];
  const comment = comments[commentId];

  return (
    <CommentComponent
      replies={comment.replies}
      id={comment.id}
      content={comment.text}
      user={users[comment.createdBy].name}
      date={new Date(comment.createdAt)}
      expanded
      showReply
      getChilrenCallback={args => ChildrenComments(args, comments, users)}
    />
  );
}

export const mapStateToProps = ({ users, comments }) => ({
  users,
  comments
});

export default connect(mapStateToProps)(CommentContainer);
