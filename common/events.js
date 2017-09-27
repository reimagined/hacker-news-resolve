/* @flow */

export type Event<Payload> = {
  aggregateId: string,
  timestamp: string,
  payload: Payload
}

// Story
const storyEvents = {
  STORY_CREATED: 'StoryCreated',
  STORY_UPVOTED: 'StoryUpvoted',
  STORY_UNVOTED: 'StoryUnvoted',
  COMMENT_CREATED: 'CommentCreated'
}

export type StoryCreated = {
  title: string,
  text: string,
  userId: string,
  link: string
}

export type StoryUpvoted = {
  userId: string
}

export type StoryUnvoted = {
  userId: string
}

export type CommentCreated = {
  userId: string,
  text: string,
  parentId: string,
  commentId: string
}

// User
const userEvents = {
  USER_CREATED: 'UserCreated'
}

export type UserCreated = {
  name: string
}

export default {
  ...storyEvents,
  ...userEvents
}
