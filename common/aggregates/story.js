import events from '../events'
import { Event } from '../helpers'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

function validateThatExists(story) {
  if (story.createdAt === undefined) {
    throw new Error('Story does not exist')
  }
}

function validateThatIsAbsent(story) {
  if (story.createdAt !== undefined) {
    throw new Error('Story already exists')
  }
}

function validateUserId(userId) {
  if (!userId) {
    throw new Error('UserId is required')
  }
}

export default {
  name: 'story',
  initialState: {},
  commands: {
    createStory: (state: any, command) => {
      validateThatIsAbsent(state)
      const { title, link, userId, text } = command.payload
      validateUserId(userId)

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
      validateThatExists(state)
      const { userId } = command.payload
      validateUserId(userId)

      if (state.voted.includes(userId)) {
        throw new Error('User already voted')
      }

      return new Event(STORY_UPVOTED, {
        userId
      })
    },

    unvoteStory: (state: any, command) => {
      validateThatExists(state)
      const { userId } = command.payload
      validateUserId(userId)

      if (!state.voted.includes(userId)) {
        throw new Error('User did not voted')
      }

      return new Event(STORY_UNVOTED, {
        userId
      })
    },

    createComment: (state: any, command) => {
      validateThatExists(state)
      const { commentId, parentId, userId, text } = command.payload
      validateUserId(userId)

      if (!userId) {
        throw new Error('UserId is required')
      }

      if (!parentId) {
        throw new Error('ParentId is required')
      }

      if (!text) {
        throw new Error('Text is required')
      }

      if (state.comments[commentId]) {
        throw new Error('Comment already exists')
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
