/* @flow */

const events = {
  NEWS_CREATED: 'NewsCreated',
  NEWS_UPVOTED: 'NewsUpvoted',
  NEWS_UNVOTED: 'NewsUnvoted',
  NEWS_DELETED: 'NewsDeleted'
};

export type NewsCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    title: string,
    userId: string,
    link: string
  }
};

export type NewsUpvoted = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string
  }
};

export type NewsUnvoted = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string
  }
};

export type NewsDeleted = {
  aggregateId: string,
  timestamp: string,
  payload: {}
};

export default events;
