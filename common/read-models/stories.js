import events from '../events'

import type {
  Event,
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  CommentCreated
} from '../events'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

export default {
  name: 'stories',
  initialState: [],
  eventHandlers: {
    [STORY_CREATED]: (state: any, event: Event<StoryCreated>) => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      state.push({
        id: aggregateId,
        type,
        title,
        text,
        link,
        commentCount: 0,
        comments: [],
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })
      return state
    },

    [STORY_UPVOTED]: (state: any, event: Event<StoryUpvoted>) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes.push(userId)
      return state
    },

    [STORY_UNVOTED]: (state: any, event: Event<StoryUnvoted>) => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes = state[index].votes.filter(id => id !== userId)
      return state
    },

    [COMMENT_CREATED]: (state: any, event: Event<CommentCreated>) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      const story = state.find(({ id }) => id === aggregateId)

      if (!story) {
        return state
      }

      story.commentCount++

      const parentIndex =
        parentId === aggregateId
          ? -1
          : story.comments.findIndex(({ id }) => id === parentId)

      const level =
        parentIndex === -1 ? 0 : story.comments[parentIndex].level + 1

      const comment = {
        id: commentId,
        text,
        parentId: parentId,
        createdAt: timestamp,
        createdBy: userId,
        level
      }

      if (parentId === -1) {
        story.comments.push(comment)
      } else {
        story.comments = story.comments
          .slice(0, parentIndex + 1)
          .concat(comment, story.comments.slice(parentIndex + 1))
      }

      return state
    }
  }
}
