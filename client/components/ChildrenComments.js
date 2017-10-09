import React from 'react'

import Comment from './Comment'
import ReplyLink from './ReplyLink'

const ChildrenComments = ({ storyId, parentId, comments, level }) => {
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
            storyId={storyId}
            level={currentLevel}
            {...comment}
          >
            <ReplyLink
              storyId={storyId}
              commentId={comment.id}
              level={currentLevel}
            />
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
