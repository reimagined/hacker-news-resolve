// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  COMMENT_CREATED
} from '../events'

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
    createStory: (state: any, command: any) => {
      validateThatIsAbsent(state)
      const { title, link, userId, text } = command.payload
      validateUserId(userId)

      if (!title) {
        throw new Error('Title is required')
      }

      const payload: StoryCreatedPayload = { title, text, link, userId }
      return { type: STORY_CREATED, payload }
    },

    upvoteStory: (state: any, command: any) => {
      validateThatExists(state)
      const { userId } = command.payload
      validateUserId(userId)

      if (state.voted.includes(userId)) {
        throw new Error('User already voted')
      }

      const payload: StoryUpvotedPayload = { userId }
      return { type: STORY_UPVOTED, payload }
    },

    unvoteStory: (state: any, command: any) => {
      validateThatExists(state)
      const { userId } = command.payload
      validateUserId(userId)

      if (!state.voted.includes(userId)) {
        throw new Error('User did not voted')
      }

      const payload: StoryUnvotedPayload = { userId }
      return { type: STORY_UNVOTED, payload }
    },

    createComment: (state: any, command: any) => {
      validateThatExists(state)
      const { commentId, parentId, userId, text } = command.payload
      validateUserId(userId)

      if (!parentId) {
        throw new Error('ParentId is required')
      }

      if (!text) {
        throw new Error('Text is required')
      }

      if (state.comments[commentId]) {
        throw new Error('Comment already exists')
      }

      const payload: CommentCreatedPayload = {
        commentId,
        parentId,
        userId,
        text
      }
      return { type: COMMENT_CREATED, payload }
    }
  },
  projection: {
    [STORY_CREATED]: (
      state,
      { timestamp, payload: { userId } }: StoryCreated
    ) => ({
      ...state,
      createdAt: timestamp,
      createdBy: userId,
      voted: [],
      comments: {}
    }),

    [STORY_UPVOTED]: (state, { payload: { userId } }: StoryUpvoted) => ({
      ...state,
      voted: state.voted.concat(userId)
    }),

    [STORY_UNVOTED]: (state, { payload: { userId } }: StoryUnvoted) => ({
      ...state,
      voted: state.voted.filter(curUserId => curUserId !== userId)
    }),
    [COMMENT_CREATED]: (
      state,
      { timestamp, payload: { commentId, userId } }: CommentCreated
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
