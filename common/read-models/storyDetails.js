import Immutable from '../immutable'
import events from '../events'
import withUserNames from '../helpers/withUserNames'

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted
} from '../events/stories'

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments'

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED,
  COMMENT_CREATED,
  COMMENT_UPDATED,
  COMMENT_REMOVED
} = events

const getCommentWithChildren = (comments, id) => {
  const parent = comments.find(comment => comment.id === id)
  const result = []
  if (parent) {
    result.push(parent)
    comments.forEach(comment => {
      if (comment.parentId === parent.id) {
        result.push(...getCommentWithChildren(comments, comment.id))
      }
    })
  }
  return result
}

export default {
  name: 'storyDetails',
  initialState: Immutable([]),
  eventHandlers: {
    [STORY_CREATED]: (state: any, event: StoryCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      return Immutable(
        [
          {
            id: aggregateId,
            type,
            title,
            text,
            createdBy: userId,
            createdAt: timestamp,
            link,
            repliesCount: 0,
            votes: []
          }
        ].concat(state)
      )
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      return state.updateIn([index, 'votes'], votes => votes.concat(userId))
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

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

      const storyIndex = state.findIndex(({ id }) => id === aggregateId)
      if (storyIndex < 0) {
        return state
      }
      if (parentId !== aggregateId) {
        const parentReplyIndex = state.findIndex(({ id }) => id === parentId)
        if (parentReplyIndex < 0) {
          return state
        }
      }

      let newState = state.updateIn(
        [storyIndex, 'repliesCount'],
        count => count + 1
      )

      return newState.set(newState.length, {
        id: commentId,
        parentId,
        text,
        createdAt: timestamp,
        createdBy: userId
      })
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      const { aggregateId, payload: { commentId, text } } = event

      const storyIndex = state.findIndex(({ id }) => id === aggregateId)
      if (storyIndex < 0) {
        return state
      }
      const commentIndex = state.findIndex(({ id }) => id === commentId)
      if (commentIndex < 0) {
        return state
      }
      return state.setIn([commentIndex, 'text'], text)
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { aggregateId, payload: { commentId } } = event

      const storyIndex = state.findIndex(({ id }) => id === aggregateId)
      if (storyIndex < 0) {
        return state
      }
      const replyIndex = state.findIndex(({ id }) => id === commentId)
      if (replyIndex < 0) {
        return state
      }

      let newState = state.updateIn(
        [storyIndex, 'repliesCount'],
        count => count - 1
      )
      return newState.filter((_, index) => index !== replyIndex) //TODO: remove kids
    }
  },
  gqlSchema: ` 
    type StoryDetails {
      id: ID!
      type: String
      title: String
      text: String
      createdBy: String!
      createdByName: String!
      createdAt: String!
      link: String
      repliesCount: Int
      votes: [String]
      parentId: ID
      storyId: ID
    }
    type Query {
      storyDetails(aggregateId: ID!, commentId: ID): [StoryDetails]
    }
  `,
  gqlResolvers: {
    storyDetails: async (root, { aggregateId, commentId }, { getReadModel }) =>
      withUserNames(
        commentId ? getCommentWithChildren(root, commentId) : root,
        getReadModel
      )
  }
}
