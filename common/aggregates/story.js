import events from '../events'
import { Event } from '../helpers'
import validate from '../validate'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

export default {
  name: 'stories',
  initialState: {},
  commands: {
    createStory: (state: any, command) => {
      validate.checkAggregateIsNotExists(state, command)

      const { title, link, userId, text } = command.payload

      if (!userId) {
        throw new Error('UserId is required')
      }

      if (!title) {
        throw new Error('Title is required')
      }

      return new Event(STORY_CREATED, {
        title,
        text,
        link,
        userId
      })
    },

    upvoteStory: (state: any, command) => {
      validate.checkAggregateIsExists(state, command)

      const { userId } = command.payload

      if (!userId) {
        throw new Error('UserId is required')
      }

      if (state.voted.includes(userId)) {
        throw new Error('User already voted')
      }

      return new Event(STORY_UPVOTED, {
        userId
      })
    },

    unvoteStory: (state: any, command) => {
      validate.checkAggregateIsExists(state, command)

      const { userId } = command.payload

      if (!userId) {
        throw new Error('UserId is required')
      }

      if (!state.voted.includes(userId)) {
        throw new Error('User has not voted')
      }

      return new Event(STORY_UNVOTED, {
        userId
      })
    },

    createComment: (state: any, command) => {
      validate.checkAggregateIsExists(state, command)

      const { commentId, parentId, userId, text } = command.payload

      if (!userId) {
        throw new Error('UserId is required')
      }

      if (!parentId) {
        throw new Error('ParentId is required')
      }

      if (!text) {
        throw new Error('Text is required')
      }

      return new Event(COMMENT_CREATED, {
        commentId,
        parentId,
        userId,
        text
      })
    }
  },
  projection: {
    [STORY_CREATED]: (state, { timestamp, payload: { userId } }) => ({
      ...state,
      createdAt: timestamp,
      createdBy: userId,
      voted: [],
      comments: {}
    }),

    [STORY_UPVOTED]: (state, { payload: { userId } }) => ({
      ...state,
      voted: state.voted.concat(userId)
    }),

    [STORY_UNVOTED]: (state, { payload: { userId } }) => ({
      ...state,
      voted: state.voted.filter(curUserId => curUserId !== userId)
    }),
    [COMMENT_CREATED]: (
      state,
      { timestamp, payload: { commentId, userId } }
    ) => ({
      ...state,
      comments: {
        ...state.comments,
        [commentId]: {
          createdAt: timestamp,
          createdBy: userId
        }
      }
    })
  }
}
