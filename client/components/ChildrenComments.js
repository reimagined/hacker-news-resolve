import React from 'react'

import Comment from './Comment'

const ChildrenComments = ({ replies, level, comments }) => {
  if (!replies.length) {
    return null
  }

  const currentLevel = level ? level + 1 : 1
  return (
    <div>
      {replies.map(replyId => {
        const comment = comments.find(({ id }) => id === replyId)

        if (!comment) {
          return null
        }

        const {
          id,
          text,
          replies,
          createdAt,
          createdBy,
          storyId,
          createdByName
        } = comment

        return (
          <Comment
            key={id}
            level={currentLevel}
            id={id}
            storyId={storyId}
            content={text}
            user={{
              id: createdBy,
              name: createdByName
            }}
            date={new Date(+createdAt)}
            showReply
          >
            <ChildrenComments
              replies={replies}
              level={currentLevel}
              comments={comments}
            />
          </Comment>
        )
      })}
    </div>
  )
}

export default ChildrenComments
