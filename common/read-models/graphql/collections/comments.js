// @flow
import { STORY_COMMENTED } from '../../../events'
import type { Event, StoryCommented } from '../../../../flow-types/events'

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
  projection: {
    [STORY_COMMENTED]: (
      state: CommentsState,
      {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      }: Event<StoryCommented>
    ) => {
      state.push({
        id: commentId,
        text,
        parentId,
        storyId: aggregateId,
        createdAt: timestamp,
        createdBy: userId
      })
      return state
    }
  }
}
