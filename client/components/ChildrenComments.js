import React from 'react';
import Comment from './Comment';

const ChildrenComments = ({ replies, level }, comments, users) => {
  return replies.map(replyId => {
    const { id, text, replies, createdAt, createdBy } = comments[replyId];
    return (
      <Comment
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
};

export default ChildrenComments;
