// @flow
import events from '../common/events'

export type ResolveEvent<Payload> = {
  aggregateId: string,
  timestamp: number,
  payload: Payload
}

// Story
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
export type UserCreated = {
  name: string
}
