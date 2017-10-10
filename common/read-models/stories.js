// @flow
import Immutable from 'seamless-immutable'

import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  COMMENT_CREATED
} from '../events'

export default {
  name: 'stories',
  initialState: Immutable([]),
  eventHandlers: {
    [STORY_CREATED]: (
      state: StoresReadModel,
      event: StoryCreated
    ): StoresReadModel => {
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
          link,
          commentCount: 0,
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        },
        ...state
      ])
    },

    [STORY_UPVOTED]: (
      state: StoresReadModel,
      event: StoryUpvoted
    ): StoresReadModel => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      return state.updateIn([index, 'votes'], votes => votes.concat(userId))
    },

    [STORY_UNVOTED]: (
      state: StoresReadModel,
      event: StoryUnvoted
    ): StoresReadModel => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      return state.updateIn([index, 'votes'], votes =>
        votes.filter(id => id !== userId)
      )
    },

    [COMMENT_CREATED]: (
      state: StoresReadModel,
      event: CommentCreated
    ): StoresReadModel => {
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId)

      if (storyIndex < 0) {
        return state
      }

      return state.updateIn([storyIndex, 'commentCount'], count => count + 1)
    }
  }
}
