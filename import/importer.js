import fs from 'fs'
import uuid from 'uuid'
import createEventStore from 'resolve-es'
import createStorage from 'resolve-storage-lite'
import createBus from 'resolve-bus-memory'

import eventTypes from '../common/events'
import api from './api'
import { databaseFilePath } from '../common/constants'

const USER_CREATED_TIMESTAMP = new Date(2007, 1, 19).getTime()

const users = {}

const storage = createStorage({ pathToFile: databaseFilePath })
const bus = createBus()

const eventStore = createEventStore({
  storage,
  bus
})

const {
  USER_CREATED,
  STORY_CREATED,
  STORY_UPVOTED,
  COMMENT_CREATED
} = eventTypes

const addEvent = (type, aggregateId, timestamp, payload) =>
  eventStore.saveEventRaw({
    type,
    aggregateId,
    timestamp,
    payload
  })

const generateUserEvents = name => {
  const aggregateId = uuid.v4()
  addEvent(USER_CREATED, aggregateId, USER_CREATED_TIMESTAMP, { name })
  users[name] = aggregateId
  return aggregateId
}

const fetchUser = userName => {
  if (users[userName]) {
    return users[userName]
  }

  const aggregateId = generateUserEvents(userName)
  users[userName] = aggregateId
  return aggregateId
}

const generateCommentEvents = (comment, aggregateId, parentId) => {
  const userId = fetchUser(comment.by)
  const commentId = uuid.v4()

  addEvent(COMMENT_CREATED, aggregateId, comment.time * 1000, {
    userId,
    text: comment.text,
    commentId,
    parentId
  })

  return commentId
}

const commentProc = async (comment, aggregateId, parentId) => {
  const commentId = generateCommentEvents(comment, aggregateId, parentId)

  if (comment.kids) {
    await commentsProc(comment.kids, aggregateId, commentId)
  }

  return aggregateId
}

const fetchItems = async ids => {
  return await api.fetchItems(ids)
}

async function commentsProc(ids, aggregateId, parentId) {
  const comments = await fetchItems(ids)
  return comments.reduce(
    (promise, comment) =>
      promise.then(
        comment && comment.by
          ? commentProc(comment, aggregateId, parentId)
          : null
      ),
    Promise.resolve()
  )
}

const generatePointEvents = (aggregateId, pointCount) => {
  const keys = Object.keys(users)
  for (let i = 0; i < Math.min(keys.length, pointCount); i++) {
    addEvent(STORY_UPVOTED, aggregateId, Date.now(), {
      userId: users[keys[i]]
    })
  }
}

const generateStoryEvents = async story => {
  if (story && story.by) {
    const aggregateId = uuid.v4()
    const userId = fetchUser(story.by)

    addEvent(STORY_CREATED, aggregateId, story.time * 1000, {
      title: story.title,
      text: story.text,
      userId,
      link: story.url
    })

    if (story.score) {
      generatePointEvents(aggregateId, story.score)
    }

    if (story.kids) {
      await commentsProc(story.kids, aggregateId, aggregateId)
    }

    return aggregateId
  }
}

const fetchStories = async (ids, tickCallback) => {
  const stories = await fetchItems(ids)

  return stories.reduce(
    (promise, story) =>
      promise.then(() => {
        tickCallback()

        return story && !story.deleted && story.by
          ? generateStoryEvents(story)
          : null
      }),
    Promise.resolve()
  )
}

const dropDatabase = () => {
  if (fs.existsSync(databaseFilePath)) {
    fs.unlinkSync(databaseFilePath)
  }
}

const fetchStoryIds = async () => {
  const categories = await Promise.all([
    api.fetchStoryIds('topstories'),
    api.fetchStoryIds('newstories'),
    api.fetchStoryIds('showstories'),
    api.fetchStoryIds('askstories')
  ])

  const resultSet = categories.reduce((set, ids) => {
    ids.forEach(id => set.add(id))
    return set
  }, new Set())

  return [...resultSet]
}

export const start = async (countCallback, tickCallback) => {
  try {
    dropDatabase()
    const storyIds = await fetchStoryIds()
    countCallback(storyIds.length)
    return await fetchStories(storyIds, tickCallback)
  } catch (e) {
    console.error(e)
  }

  return null
}
