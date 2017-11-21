import Immutable from 'seamless-immutable'

import type {
  Event,
  StoryCommented,
  StoryCreated,
  StoryUnvoted,
  StoryUpvoted,
  UserCreated
} from '../../flow-types/events'
import {
  STORY_COMMENTED,
  STORY_CREATED,
  STORY_UNVOTED,
  STORY_UPVOTED
} from '../events'
import { log } from 'util'

export default {
  name: 'storyDetails',
  projection: {
    Init: () => Immutable({}),
    [STORY_CREATED]: (
      state: any,
      {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      }: Event<StoryCreated>
    ) => {
      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      return Immutable({
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
    },

    [STORY_UPVOTED]: (
      state: any,
      { aggregateId, payload: { userId } }: Event<StoryUpvoted>
    ) => state.update('votes', votes => votes.concat(userId)),

    [STORY_UNVOTED]: (
      state: any,
      { aggregateId, payload: { userId } }: Event<StoryUnvoted>
    ) => state.update('votes', votes => votes.filter(id => id !== userId)),

    [STORY_COMMENTED]: (
      state,
      {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      }: Event<StoryCommented>
    ) => {
      const parentIndex =
        parentId === aggregateId
          ? -1
          : state.comments.findIndex(({ id }) => id === parentId)

      const level =
        parentIndex === -1 ? 0 : state.comments[parentIndex].level + 1

      const comment = {
        id: commentId,
        parentId,
        level,
        text,
        createdAt: timestamp,
        createdBy: userId
      }

      const newState = state.update('commentCount', count => count + 1)

      if (parentIndex === -1) {
        return newState.update('comments', comments => comments.concat(comment))
      } else {
        return newState.update('comments', comments =>
          comments
            .slice(0, parentIndex + 1)
            .concat(comment, comments.slice(parentIndex + 1))
        )
      }
    }
  },
  serializeState: (state: any) =>
    JSON.stringify({ storyDetails: state || Immutable({}) }),
  deserializeState: (serial: any) => JSON.parse(serial)
}
