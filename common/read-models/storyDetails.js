import Immutable from 'seamless-immutable'

import events from '../events'

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted
} from '../events/stories'

import type { CommentCreated } from '../events/comments'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

export default {
  name: 'storyDetails',
  // TODO: remove me!!!
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
          comments: [],
          votes: []
        }
      ])
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        // TODO: fix me!
        return state
      }

      return state.updateIn([index, 'votes'], votes => votes.concat(userId))
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        // TODO: fix me!
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

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        // TODO: fix me!
        return state
      }

      if (!commentId) {
        return state
      }

      if (parentId !== aggregateId) {
        let parentCommentIndex = state
          .getIn([index, 'comments'])
          .findIndex(({ id }) => id === parentId)
        if (parentCommentIndex < 0) {
          return state
        }
      }

      return state.updateIn([index, 'comments'], comments =>
        comments.concat({
          id: commentId,
          parentId,
          text,
          createdAt: timestamp,
          createdBy: userId
        })
      )
    }
  }
}
