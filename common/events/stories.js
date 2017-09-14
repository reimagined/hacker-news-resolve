/* @flow */

const events = {
  STORY_CREATED: 'StoryCreated',
  STORY_UPVOTED: 'StoryUpvoted',
  STORY_UNVOTED: 'StoryUnvoted'
}

export type StoryCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    title: string,
    text: string,
    userId: string,
    link: string
  }
}

export type StoryUpvoted = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string
  }
}

export type StoryUnvoted = {
  aggregateId: string,
  timestamp: string,
  payload: {
    userId: string
  }
}

export default events
