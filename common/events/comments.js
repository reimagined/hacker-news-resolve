/* @flow */

const events = {
  COMMENT_CREATED: 'CommentCreated',
  COMMENT_UPDATED: 'CommentUpdated',
  COMMENT_REMOVED: 'CommentRemoved'
};

export type CommentCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string,
    text: string,
    parentId: string
  }
};

export type CommentUpdated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string,
    text: string
  }
};

export type CommentRemoved = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string
  }
};

export default events;
