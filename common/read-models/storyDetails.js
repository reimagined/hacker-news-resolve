import Immutable from '../immutable'
import events from '../events'
import withUserNames from '../helpers/withUserNames'

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  StoryDeleted
} from '../events/stories'

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments'

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED,
  COMMENT_CREATED,
  COMMENT_UPDATED,
  COMMENT_REMOVED
} = events

const getCommentWithChildren = (comments, id) => {
  const comment = comments.find(comment => comment.id === id)
  const result = []
  if (comment) {
    result.push(comment)
    comment.replies.forEach(commentId =>
      result.push(...getCommentWithChildren(comments, commentId))
    )
  }
  return result
}

export default {
  name: 'storyDetails',
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
            createdBy: userId,
            createdAt: timestamp,
            link,
            replies: [],
            repliesCount: 0,
            votes: []
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

    [STORY_DELETED]: (state: any, event: StoryDeleted) => Immutable([]),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, commentId, userId, text }
      } = event

      const storyIndex = state.findIndex(({ id }) => id === aggregateId)
      const parentIndex = state.findIndex(({ id }) => id === parentId)

      if (storyIndex < 0 || parentIndex < 0) {
        return state
      }

      let newState = state.updateIn(
        [storyIndex, 'repliesCount'],
        count => count + 1
      )

      newState = newState.set(newState.length, {
        text,
        id: commentId,
        parentId,
        storyId: aggregateId,
        createdAt: timestamp,
        createdBy: userId,
        replies: []
      })

      return newState.updateIn([parentIndex, 'replies'], replies =>
        replies.concat(commentId)
      )
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      const { payload: { text, commentId } } = event

      const commentIndex = state.findIndex(comment => comment.id === commentId)

      return state.setIn([commentIndex, 'text'], text)
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { aggregateId, payload: { parentId, commentId } } = event

      const storyIndex = state.findIndex(({ id }) => id === aggregateId)
      const parentIndex = state.findIndex(({ id }) => id === parentId)
      const commentIndex = state.findIndex(({ id }) => id === commentId)

      if (storyIndex < 0 || parentIndex < 0 || commentIndex < 0) {
        return state
      }

      let newState = state.updateIn(
        [storyIndex, 'repliesCount'],
        count => count - 1
      )

      newState = newState.filter((_, index) => index !== commentIndex)

      newState.updateIn([parentIndex, 'replies'], replies =>
        replies.filter(id => id !== commentId)
      )
    }
  },
  gqlSchema: ` 
    type StoryDetails {
      id: ID!
      type: String
      title: String
      text: String
      createdBy: String!
      createdByName: String!
      createdAt: String!
      link: String
      replies: [String]
      repliesCount: Int
      votes: [String]
      parentId: ID
      storyId: ID
    }
    type Query {
      storyDetails(aggregateId: ID!, commentId: ID): [StoryDetails]
    }
  `,
  gqlResolvers: {
    storyDetails: async (root, { aggregateId, commentId }, { getReadModel }) =>
      withUserNames(
        commentId ? getCommentWithChildren(root, commentId) : root,
        getReadModel
      )
  }
}
