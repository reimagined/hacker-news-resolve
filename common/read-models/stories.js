import Immutable from '../immutable'
import events from '../events'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'
import withUserNames from '../helpers/withUserNames'

import type { CommentCreated } from '../events/comments'
import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted
} from '../events/stories'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

export default {
  name: 'stories',
  initialState: Immutable([]),
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
          commentCount: 0,
          votes: []
        },
        ...state
      ])
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
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId)

      if (storyIndex < 0) {
        return state
      }

      return state.updateIn([storyIndex, 'commentCount'], count => count + 1)
    }
  },
  gqlSchema: `
    type Story {
      id: ID!
      type: String!
      title: String!
      link: String
      commentCount: Int!
      votes: [String]
      createdAt: String!
      createdBy: String!
      createdByName: String!
    }
    type Query {
      stories(page: Int!, type: String): [Story]
    }
  `,
  gqlResolvers: {
    stories: async (root, { page, type }, { getReadModel }) => {
      const stories = (type
        ? root.filter(story => story.type === type)
        : root).slice(
        +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
        +page * NUMBER_OF_ITEMS_PER_PAGE + 1
      )

      return withUserNames(stories, getReadModel)
    }
  }
}
