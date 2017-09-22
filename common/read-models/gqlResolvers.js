import Immutable from 'seamless-immutable'

import withUserNames from '../helpers/withUserNames'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'

const findCommentsById = (comments, id) => {
  const parent = comments.find(comment => comment.id === id)
  const result = []
  if (parent) {
    result.push(parent)
    comments.forEach(comment => {
      if (comment.parentId === parent.id) {
        result.push(...findCommentsById(comments, comment.id))
      }
    })
  }
  return result
}

const getCommentWithChildren = (state, commentId) => {
  const story = state[0]
  return [
    {
      id: story.id,
      comments: findCommentsById(story.comments, commentId)
    }
  ]
}

export default {
  stories: async (read, { page, type }) => {
    const root = (await read()).get('stories')
    const stories = (type
      ? root.filter(story => story.type === type)
      : root).slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(stories, read)
  },
  comments: async (read, { page }) => {
    const root = (await read()).get('comments')
    const comments = root.slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(comments, read)
  },
  storyDetails: async (read, { commentId }) => {
    const state = (await read()).get('storyDetails')
    let newState
    if (commentId) {
      newState = Immutable(getCommentWithChildren(state, commentId))
    } else {
      newState = Immutable(await withUserNames(state, read))
    }
    const comments = Immutable(await withUserNames(newState[0].comments, read))
    return newState.setIn([0, 'comments'], comments)
  },
  users: async (read, { id, name }) => {
    const root = (await read()).get('users')
    const user = name
      ? root.find(user => name === user.name)
      : root.find(user => id === user.id)
    return user ? [user] : []
  }
}
