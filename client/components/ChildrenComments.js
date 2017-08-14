import React from 'react';
import CommentComponent from './CommentComponent';

function ChildrenComments({ replies, level }, comments, users) {
  return replies.map(replyId => {
    const { id, text, replies, createdAt, createdBy } = comments[replyId];
    return (
      <CommentComponent
        replies={replies}
        level={level}
        id={id}
        content={text}
        user={users[createdBy].name}
        date={new Date(createdAt)}
        expanded
        showReply
        getChilrenCallback={args => ChildrenComments(args, comments, users)}
      />
    );
  });
}

export default ChildrenComments;
