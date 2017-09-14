import React from 'react'

import Comment from './Comment'

const ChildrenComments = ({ storyId, comments, parentId, level }) => {
  if (!comments.length) {
    return null
  }

  const currentLevel = level ? level + 1 : 1
  return (
    <div>
      {comments.map(comment => {
        if (comment.parentId !== parentId) {
          return null
        }
        return (
          <Comment
            key={comment.id}
            level={currentLevel}
            storyId={storyId}
            {...comment}
            showReply
          >
            <ChildrenComments
              storyId={storyId}
              comments={comments}
              parentId={comment.id}
              level={currentLevel}
            />
          </Comment>
        )
      })}
    </div>
  )
}

export default ChildrenComments
