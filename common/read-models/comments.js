// @flow
import { COMMENT_CREATED } from '../events'

type Comment = {
  id: string,
  text: string,
  parentId: string,
  storyId: string,
  createdAt: number,
  createdBy: string
}

type CommentsState = Array<Comment>

export default {
  name: 'comments',
  initialState: [],
  eventHandlers: {
    [COMMENT_CREATED]: (
      state: CommentsState,
      event: ResolveEvent<CommentCreated>
    ) => {
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
