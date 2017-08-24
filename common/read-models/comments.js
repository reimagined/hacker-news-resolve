import Immutable from '../immutable';

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
      const id = getId(event);
      let nextState = state;
      if (nextState[event.payload.parentId]) {
        nextState = nextState.updateIn(
          [event.payload.parentId, 'replies'],
          replies => replies.concat(id)
        );
      }

      return nextState.set(id, {
        text: event.payload.text,
        id,
        parentId: event.payload.parentId,
        storyId: event.aggregateId,
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        replies: []
      });
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      return state.setIn([getId(event), 'text'], event.payload.text);
    },

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
