import Immutable from 'seamless-immutable'

import type { CommentCreated } from '../events/comments'
import events from '../events'

const { COMMENT_CREATED } = events

export default {
  name: 'comments',
  initialState: Immutable([]),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      return Immutable(
        [
          {
            id: commentId,
            text,
            parentId: parentId,
            storyId: aggregateId,
            createdAt: timestamp,
            createdBy: userId
          }
        ].concat(state)
      )
    }
  }
}
