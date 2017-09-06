import Immutable from '../immutable'
import events from '../events'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants'

import type { CommentCreated, CommentRemoved } from '../events/comments'
import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  StoryDeleted
} from '../events/stories'

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED,
  COMMENT_CREATED,
  COMMENT_REMOVED,
  USER_CREATED
} = events

const userNameById = {}

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

      return Immutable(
        [
          {
            id: aggregateId,
            type,
            title,
            text,
            userId,
            createDate: timestamp,
            link,
            comments: [],
            commentsCount: 0,
            voted: []
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

      return state.updateIn([index, 'voted'], voted => voted.concat(userId))
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      return state.updateIn([index, 'voted'], voted =>
        voted.filter(id => id !== userId)
      )
    },

    [STORY_DELETED]: (state: any, event: StoryDeleted) =>
      state.filter(({ id }) => id !== event.aggregateId),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const { parentId, commentId } = event.payload
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId)

      if (storyIndex < 0) {
        return state
      }

      let newState = state.updateIn(
        [storyIndex, 'commentsCount'],
        count => count + 1
      )

      const parentIndex = state.findIndex(({ id }) => id === parentId)

      if (parentIndex < 0) {
        return newState
      }

      return newState.updateIn([parentIndex, 'comments'], comments =>
        comments.concat(commentId)
      )
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { parentId, commentId } = event.payload
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId)

      if (storyIndex < 0) {
        return state
      }

      let newState = state.updateIn(
        [storyIndex, 'commentsCount'],
        count => count - 1
      )

      const parentIndex = state.findIndex(({ id }) => id === parentId)

      if (parentIndex < 0) {
        return newState
      }

      return newState.updateIn([parentIndex, 'comments'], comments =>
        comments.filter(id => id !== commentId)
      )
    },

    [USER_CREATED]: (state: any, event: UserCreated) => {
      const { aggregateId, payload: { name } } = event
      userNameById[aggregateId] = name
      return state
    }
  },
  gqlSchema: `
    type Story {
      id: ID!
      type: String!
      title: String!
      text: String
      userId: String!
      userName: String
      createDate: String!
      link: String
      comments: [String]
      commentsCount: Int!
      voted: [String]
    }
    type Query {
      stories(page: Int, aggregateId: ID, type: String): [Story]
    }
  `,
  gqlResolvers: {
    stories: (root, { page, aggregateId, type }) =>
      (aggregateId
        ? root
        : page
          ? (type ? root.filter(story => story.type === type) : root).slice(
              +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
              +page * NUMBER_OF_ITEMS_PER_PAGE + 1
            )
          : root).map(story => ({
        ...story,
        userName: userNameById[story.userId]
      }))
  }
}
