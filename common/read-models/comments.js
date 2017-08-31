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
  initialState: Immutable([]),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, text }
      } = event;

      const id = getId(event);
      let nextState = state;
      const parentIndex = state.findIndex(({ id }) => id === parentId);
      ('');

      if (parentIndex >= 0) {
        nextState = nextState.updateIn([parentIndex, 'replies'], replies =>
          replies.concat(id)
        );
      }

      return Immutable(
        [
          {
            text,
            id,
            parentId: parentId,
            storyId: aggregateId,
            createdAt: timestamp,
            createdBy: userId,
            replies: []
          }
        ].concat(nextState)
      );
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      const { text } = event.payload;
      const id = getId(event);
      const index = state.findIndex(comment => comment.id === id);
      return state.setIn([index, 'text'], text);
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const id = getId(event);
      const commentIndex = state.findIndex(comment => comment.id === id);
      const parentId = state[commentIndex].parentId;
      const parentIndex = state.findIndex(comment => comment.id === parentId);

      let nextState = state;

      if (parentIndex >= 0) {
        nextState = nextState.updateIn([parentIndex, 'replies'], replies =>
          replies.filter(replyId => replyId !== id)
        );
      }

      return nextState
        .slice(0, commentIndex)
        .concat(nextState.slice(commentIndex + 1));
    }
  }
};
