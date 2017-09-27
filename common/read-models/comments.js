import Immutable from 'seamless-immutable'

import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'
import type { CommentCreated } from '../events/story'
import events from '../events'
import withUserNames from '../helpers/withUserNames'

const { COMMENT_CREATED } = events

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
    }
  },
  gqlSchema: `
    type Comment {
      id: ID!
      parentId: ID!
      storyId: ID!
      text: String!
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
