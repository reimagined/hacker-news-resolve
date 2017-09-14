/* @flow */

const events = {
  COMMENT_CREATED: 'CommentCreated'
}

export type CommentCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string,
    text: string,
    parentId: string,
    commentId: string
  }
}

export default events
