import Immutable from 'seamless-immutable'

import events from '../events'

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
          link,
          commentCount: 0,
          votes: [],
          createdAt: timestamp,
          createdBy: userId
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
  }
}
