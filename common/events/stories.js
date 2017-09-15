/* @flow */

const events = {
  STORY_CREATED: 'StoryCreated',
  STORY_UPVOTED: 'StoryUpvoted',
  STORY_UNVOTED: 'StoryUnvoted'
}

export type StoryCreated = {
  payload: {
    title: string,
    text: string,
    userId: string,
    link: string
  }
}

export type StoryUpvoted = {
  payload: {
    userId: string
  }
}

export type StoryUnvoted = {
  payload: {
    userId: string
  }
}

export default events
