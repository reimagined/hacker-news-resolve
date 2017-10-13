// @flow

// Story
export type StoryCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: {
    userId: string,
    title: string,
    text: string,
    link: string
  }
}

export type StoryUpvoted = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: {
    userId: string
  }
}

export type StoryUnvoted = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: {
    userId: string
  }
}

export type CommentCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: {
    commentId: string,
    parentId: string,
    userId: string,
    text: string
  }
}

// User
export type UserCreated = {
  type: string,
  aggregateId: string,
  timestamp: number,
  payload: {
    name: string
  }
}
