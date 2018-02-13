// @flow

import {
  STORY_COMMENTED,
  STORY_CREATED,
  STORY_UNVOTED,
  STORY_UPVOTED,
  USER_CREATED
} from '../../events'
import {
  type Event,
  type StoryCommented,
  type StoryCreated,
  type StoryUnvoted,
  type StoryUpvoted,
  type UserCreated
} from '../../../flow-types/events'

const updateStories = async (store, storyType, storyId, handler) => {
  const stories = (await store.hget('stories', storyType)) || []
  const i = stories.findIndex(story => story.id === storyId)
  if (i >= 0) {
    stories[i] = handler(stories[i])
    await store.hset('stories', storyType, stories.slice(0, 500))
  }
}

const updateAllStories = async (store, aggregateId, handler) => {
  await updateStories(store, 'story', aggregateId, handler)
  await updateStories(store, 'show', aggregateId, handler)
  await updateStories(store, 'ask', aggregateId, handler)
}

export default {
  [STORY_COMMENTED]: async (
    store,
    {
      aggregateId,
      timestamp,
      payload: { parentId, userId, userName, commentId, text }
    }: Event<StoryCommented>
  ) => {
    const comment = {
      id: commentId,
      text,
      parentId,
      comments: [],
      storyId: aggregateId,
      createdAt: timestamp,
      createdBy: userId,
      createdByName: userName
    }
    let comments = await store.hget('comments', 'all')
    comments = comments ? comments : []
    comments.unshift(comment)
    await store.hset('comments', 'all', comments.slice(0, 500))

    await updateAllStories(store, aggregateId, story => {
      story.commentCount++
      return story
    })
  },

  [STORY_CREATED]: async (
    store,
    {
      aggregateId,
      timestamp,
      payload: { title, link, userId, userName, text }
    }: Event<StoryCreated>
  ) => {
    const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'
    const allStoriesType = 'story'

    const story = {
      id: aggregateId,
      type,
      title,
      text,
      link,
      commentCount: 0,
      votes: [],
      createdAt: timestamp,
      createdBy: userId,
      createdByName: userName
    }

    const insertToStories = async key => {
      let stories = await store.hget('stories', key)
      stories = stories ? stories : []
      stories.unshift(story)
      await store.hset('stories', key, stories.slice(0, 500))
    }

    if (type !== allStoriesType) {
      await insertToStories(type)
    }
    await insertToStories(allStoriesType)
  },

  [STORY_UPVOTED]: async (
    store,
    { aggregateId, payload: { userId } }: Event<StoryUpvoted>
  ) => {
    await updateAllStories(store, aggregateId, story => {
      story.votes.push(userId)
      return story
    })
  },

  [STORY_UNVOTED]: async (
    store,
    { aggregateId, payload: { userId } }: Event<StoryUnvoted>
  ) => {
    await updateAllStories(store, aggregateId, story => {
      story.votes = story.votes.filter(vote => vote !== userId)
      return story
    })
  },

  [USER_CREATED]: async (
    store,
    { aggregateId, timestamp, payload: { name } }: Event<UserCreated>
  ) => {
    const user = {
      id: aggregateId,
      name,
      createdAt: timestamp
    }

    await store.hset('users_id', aggregateId, user)
    await store.hset('users_name', name, user)
  }
}
