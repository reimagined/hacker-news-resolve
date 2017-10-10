// @flow
import events from '../common/events'

export type ResolveEvent<Payload> = {
  aggregateId: string,
  timestamp: string,
  payload: Payload
}

// Story
export type storyEvents =
  | STORY_CREATED
  | STORY_UPVOTED
  | STORY_UNVOTED
  | COMMENT_CREATED

export type StoryCreated = ResolveEvent<{
  title: string,
  text: string,
  userId: string,
  link: string
}>

export type StoryUpvoted = ResolveEvent<{
  userId: string
}>

export type StoryUnvoted = ResolveEvent<{
  userId: string
}>

export type CommentCreated = ResolveEvent<{
  userId: string,
  text: string,
  parentId: string,
  commentId: string
}>

// User
export type userEvents = USER_CREATED

export type UserCreated = ResolveEvent<{
  name: string
}>
