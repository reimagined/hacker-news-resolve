// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_COMMENTED
} from '../events'
import validate from './validation'

export default {
  name: 'story',
  initialState: {},
  commands: {
    createStory: (state: any, command: any) => {
      validate.stateIsAbsent(state, 'Story')

      const { title, link, userId, text } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.fieldRequired(command.payload, 'title')

      const payload: StoryCreatedPayload = { title, text, link, userId }
      return { type: STORY_CREATED, payload }
    },

    upvoteStory: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { userId } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.userNotVoted(state, userId)

      const payload: StoryUpvotedPayload = { userId }
      return { type: STORY_UPVOTED, payload }
    },

    unvoteStory: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { userId } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.userVoted(state, userId)

      const payload: StoryUnvotedPayload = { userId }
      return { type: STORY_UNVOTED, payload }
    },

    commentStory: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { commentId, parentId, userId, text } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.fieldRequired(command.payload, 'parentId')
      validate.fieldRequired(command.payload, 'text')
      validate.commentNotExists(state, commentId)

      const payload: StoryCommentedPayload = {
        commentId,
        parentId,
        userId,
        text
      }
      return { type: STORY_COMMENTED, payload }
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
    [STORY_COMMENTED]: (
      state,
      { timestamp, payload: { commentId, userId } }: StoryCommented
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
