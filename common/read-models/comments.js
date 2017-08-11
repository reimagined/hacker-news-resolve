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
      return state.setIn([event.aggregateId], {
        text: event.payload.text,
        id: event.aggregateId,
        parentId: event.payload.parentId,
        createdAt: event.timestamp,
        createdBy: event.payload.userId
      });
    },
    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      return state.update(event.aggregateId, comment =>
        comment.set('text', event.payload.text)
      );
    },
    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      return state.without(event.aggregateId);
    }
  }
};
