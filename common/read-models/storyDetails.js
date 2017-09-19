import Immutable from '../immutable'
import events from '../events'
import withUserNames from '../helpers/withUserNames'

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted
} from '../events/stories'

import type { CommentCreated } from '../events/comments'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

const _getCommentWithChildren = (comments, id) => {
  const parent = comments.find(comment => comment.id === id)
  const result = []
  if (parent) {
    result.push(parent)
    comments.forEach(comment => {
      if (comment.parentId === parent.id) {
        result.push(..._getCommentWithChildren(comments, comment.id))
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
      comments: _getCommentWithChildren(story.comments, commentId)
    }
  ]
}

export default {
  name: 'storyDetails',
  initialState: Immutable([]), // todo: remove me!!!
  eventHandlers: {
    [STORY_CREATED]: (state: any, event: StoryCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      return Immutable([
        {
          id: aggregateId,
          type,
          title,
          text,
          createdBy: userId,
          createdAt: timestamp,
          link,
          comments: [],
          commentCount: 0,
          votes: []
        }
      ])
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (
        index < 0 // todo: fix me!
      )
        return state

      return state.updateIn([index, 'votes'], votes => votes.concat(userId))
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (
        index < 0 // todo: fix me!
      )
        return state

      return state.updateIn([index, 'votes'], votes =>
        votes.filter(id => id !== userId)
      )
    },

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, commentId, userId, text }
      } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (
        index < 0 // todo: fix me!
      )
        return state

      if (!commentId) {
        return state
      }

      if (parentId !== aggregateId) {
        let parentCommentIndex
        state.getIn([index, 'comments'], comments => {
          parentCommentIndex = comments.findIndex(({ id }) => id === parentId)
        })
        if (parentCommentIndex < 0) {
          return state
        }
      }

      let commentCount = 0
      const newState = state
        .updateIn([index, 'commentCount'], count => {
          commentCount = count + 1
          return commentCount
        })
        .setIn([index, 'comments', commentCount - 1], {
          id: commentId,
          parentId,
          text,
          createdAt: timestamp,
          createdBy: userId
        })
      return newState
    }
  },
  gqlSchema: `
    type Comment {
      id: ID
      parentId: ID
      text: String
      createdAt: String
      createdBy: String
    }
    type StoryDetails {
      id: ID!
      type: String
      title: String
      text: String
      link: String
      comments: [Comment],
      commentCount: Int
      votes: [String]
      createdAt: String
      createdBy: String
      createdByName: String
    }
    type Query {
      storyDetails(aggregateId: ID!, commentId: ID): [StoryDetails]
    }
  `,
  gqlResolvers: {
    storyDetails: async (state, { commentId }, { getReadModel }) => {
      let newState
      if (commentId) {
        newState = getCommentWithChildren(state, commentId)
      } else {
        newState = await withUserNames(state, getReadModel)
      }
      const comments = await withUserNames(newState[0].comments, getReadModel)
      newState[0].comments = comments
      return newState
    }
  }
}
