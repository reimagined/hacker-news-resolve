// @flow

export type StoryCreatedPayload = {
  userId: string,
  title: string,
  text: string,
  link: string
}

export type StoryCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: StoryCreatedPayload
}

export type StoryUpvotedPayload = {
  userId: string
}

export type StoryUpvoted = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: StoryUpvotedPayload
}

export type StoryUnvotedPayload = {
  userId: string
}

export type StoryUnvoted = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: StoryUnvotedPayload
}

export type CommentCreatedPayload = {
  commentId: string,
  parentId: string,
  userId: string,
  text: string
}

export type CommentCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: CommentCreatedPayload
}

// User
export type UserCreatedPayload = {
  name: string
}

export type UserCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: UserCreatedPayload
}
