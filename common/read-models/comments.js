import Immutable from 'seamless-immutable';

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments';
import events from '../events/comments';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

export default {
  name: 'comments',
  initialState: Immutable({}),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      let nextState = state;
      if (nextState[event.payload.parentId]) {
        nextState = nextState.updateIn(
          [event.payload.parentId, 'replies'],
          replies => replies.concat(event.aggregateId)
        );
      }

      return nextState.set(event.aggregateId, {
        text: event.payload.text,
        id: event.aggregateId,
        parentId: event.payload.parentId,
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        replies: []
      });
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      return state.update(event.aggregateId, comment =>
        comment.set('text', event.payload.text)
      );
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      let nextState = state;
      const parentId = nextState[event.payload.aggregateId].parentId;
      if (nextState[parentId]) {
        nextState = nextState.updateIn([parentId, 'replies'], list =>
          list.filter(item => item !== event.aggregateId)
        );
      }

      return nextState.without(event.aggregateId);
    }
  }
};
