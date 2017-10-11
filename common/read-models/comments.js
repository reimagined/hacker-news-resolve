import type { Event, CommentCreated } from '../events'
import events from '../events'

const { COMMENT_CREATED } = events

export default {
  name: 'comments',
  initialState: [],
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: Event<CommentCreated>) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      state.push({
        id: commentId,
        text,
        parentId: parentId,
        storyId: aggregateId,
        createdAt: timestamp,
        createdBy: userId
      })
      return state
    }
  }
}
