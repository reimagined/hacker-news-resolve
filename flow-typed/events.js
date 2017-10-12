// @flow

// Story
export type StoryCreated = {
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
  aggregateId: string,
  timestamp: number,
  payload: {
    userId: string
  }
}

export type StoryUnvoted = {
  aggregateId: string,
  timestamp: number,
  payload: {
    userId: string
  }
}

export type CommentCreated = {
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
  aggregateId: string,
  timestamp: number,
  payload: {
    name: string
  }
}
