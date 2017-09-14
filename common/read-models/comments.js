import Immutable from '../immutable'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments'
import events from '../events'
import withUserNames from '../helpers/withUserNames'

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events

export default {
  name: 'comments',
  initialState: Immutable([]),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      return Immutable(
        [
          {
            id: commentId,
            text,
            parentId: parentId,
            storyId: aggregateId,
            createdAt: timestamp,
            createdBy: userId
          }
        ].concat(state)
      )
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      const { payload: { commentId, text } } = event

      const commentIndex = state.findIndex(comment => comment.id === commentId)

      return state.setIn([commentIndex, 'text'], text)
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { payload: { commentId } } = event

      return state.filter(({ id }) => id !== commentId)
    }
  },
  gqlSchema: `
    type Comment {
      text: String!
      id: ID!
      parentId: ID!
      storyId: ID!
      createdAt: String!
      createdBy: String!
      createdByName: String!
    }
    type Query {
      comments(page: Int!): [Comment]
    }
  `,
  gqlResolvers: {
    comments: async (root, { page }, { getReadModel }) => {
      const comments = root.slice(
        +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
        +page * NUMBER_OF_ITEMS_PER_PAGE + 1
      )

      return withUserNames(comments, getReadModel)
    }
  }
}
