import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import ChildrenComments from '../components/ChildrenComments';
import Comment from '../components/Comment';
import getById from '../helpers/getById';

export const CommentContainer = ({ comments, users, location }) => {
  const { id } = queryString.parse(location.search);
  const comment = comments.find(c => c.id === id);
  const user = getById(users, comment.createdBy);

  return (
    <Comment
      id={comment.id}
      content={comment.text}
      user={user.name}
      date={new Date(comment.createdAt)}
      showReply
    >
      <ChildrenComments
        replies={comment.replies}
        comments={comments}
        users={users}
      />
    </Comment>
  );
};

export const mapStateToProps = ({ users, comments }) => ({
  users,
  comments
});

export default connect(mapStateToProps)(CommentContainer);
