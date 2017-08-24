import Immutable from 'seamless-immutable';

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments';
import events from '../events/comments';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

const getId = event => event.payload.commentId;

export default {
  name: 'comments',
  initialState: Immutable({}),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, text }
      } = event;
      const id = getId(event);

      let nextState = state;
      if (nextState[parentId]) {
        nextState = nextState.updateIn([parentId, 'replies'], replies =>
          replies.concat(id)
        );
      }

      return nextState.set(id, {
        text,
        id,
        parentId: parentId,
        storyId: aggregateId,
        createdAt: timestamp,
        createdBy: userId,
        replies: []
      });
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) =>
      state.setIn([getId(event), 'text'], event.payload.text),

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const id = getId(event);
      let nextState = state;
      const parentId = nextState[id].parentId;
      if (nextState[parentId]) {
        nextState = nextState.updateIn([parentId, 'replies'], replies =>
          replies.filter(curId => curId !== id)
        );
      }

      return nextState.without(id);
    }
  }
};
