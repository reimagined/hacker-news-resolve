import React from 'react';
import { connect } from 'react-redux';

import ChildrenComments from '../components/ChildrenComments';
import Comment from '../components/Comment';
import subscribe from '../decorators/subscribe';

export const CommentContainer = ({ comments, users, match }) => {
  const { id } = match.params;
  const comment = comments.find(c => c.id === id);
  const user = users.find(({ id }) => id === comment.createdBy);

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

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: 'comments',
      query:
        'query ($id: String!) { comments(id: $id) { text, id, parentId, createdAt, createdBy, replies } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps)(CommentContainer));
