import React from 'react';

import Comment from './Comment';

const ChildrenComments = ({ replies, level, comments, users }) => {
  if (!replies.length) {
    return null;
  }

  const currentLevel = level ? level + 1 : 1;
  return (
    <div>
      {replies.map(replyId => {
        const comment = comments.find(({ id }) => id === replyId);
        const { id, text, replies, createdAt, createdBy } = comment;

        return (
          <Comment
            key={id}
            level={currentLevel}
            id={id}
            content={text}
            user={users[createdBy].name}
            date={new Date(createdAt)}
            showReply
          >
            <ChildrenComments
              replies={replies}
              level={currentLevel}
              comments={comments}
              users={users}
            />
          </Comment>
        );
      })}
    </div>
  );
};

export default ChildrenComments;
