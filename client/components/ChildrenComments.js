import React from 'react';

import Comment from './Comment';

export const getChilrenCallback = (comments, users) => props =>
  ChildrenComments(props, comments, users);

const ChildrenComments = ({ replies, level }, comments, users) => {
  return replies.map(replyId => {
    const { id, text, replies, createdAt, createdBy } = comments[replyId];
    return (
      <Comment
        key={id}
        replies={replies}
        level={level}
        id={id}
        content={text}
        user={users[createdBy].name}
        date={new Date(createdAt)}
        showReply
        getChilrenCallback={getChilrenCallback(comments, users)}
      />
    );
  });
};

export default ChildrenComments;
