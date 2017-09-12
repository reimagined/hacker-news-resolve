import fs from 'fs'
import uuid from 'uuid'
import createEventStore from 'resolve-es'
import createStorage from '../common/storage-driver'
import createBus from 'resolve-bus-memory'

import eventTypes from '../common/events/index'
import HNServiceRest from './services/HNServiceRest'

const dbPath = './storage.json'
const USER_CREATED_TIMESTAMP = 3600 * 24 * 1000

const users = {}
const storyIds = []

const storage = createStorage({ pathToFile: dbPath })
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
  eventStore.saveEvent({
    type,
    aggregateId,
    timestamp,
    payload
  })

const generateUserEvents = name => {
  const aggregateId = uuid.v4()
  addEvent(USER_CREATED, aggregateId, USER_CREATED_TIMESTAMP, {
    name,
    passwordHash: 'TODO:'
  })
  users[name] = aggregateId
  return aggregateId
}

const userProc = userName => {
  if (users[userName]) {
    return users[userName]
  }
  const aggregateId = generateUserEvents(userName)
  users[userName] = aggregateId
  return aggregateId
}

const generateCommentEvents = (comment, aggregateId, parentId) => {
  const userId = userProc(comment.by)
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
  return HNServiceRest.fetchItems(ids)
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
    const userId = userProc(story.by)
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

const needUpload = id => storyIds.indexOf(id) === -1

const removeDuplicate = ids => {
  const result = ids.filter(needUpload)
  result.forEach(id => storyIds.push(id))
  return result
}

const storiesProc = async (ids, tickCallback) => {
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

const getStories = async path => {
  const response = await HNServiceRest.storiesRef(path)
  return response.json()
}

export const start = async (countCallback, tickCallback) => {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
  }
  try {
    const categories = await Promise.all([
      getStories('topstories'),
      getStories('newstories'),
      getStories('showstories'),
      getStories('askstories')
    ])
    const stories = categories.reduce(
      (stories, category) => stories.concat(removeDuplicate(category)),
      []
    )
    countCallback(stories.length)
    return await storiesProc(stories, tickCallback)
  } catch (e) {
    console.error(e)
  }
  return null
}
