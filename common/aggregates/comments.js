import Immutable from 'seamless-immutable';

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments';
import events from '../events/comments';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import throwIfAggregateIsNotExists from './validators/throwIfAggregateIsNotExists';
import throwIfPermissionDenied from './validators/throwIfPermissionDenied';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

export default {
  name: 'comments',
  initialState: Immutable({}),
  eventHandlers: {
    [COMMENT_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        createdBy: event.user.id
      }),
    [COMMENT_REMOVED]: (state, event) => state.set('removedAt', event.timestamp)
  },
  commands: {
    createComment: (state: any, command: CommentCreated) => {
      const { text, parentId, userId } = command.payload;

      throwIfAggregateAlreadyExists(state, command);

      if (!text) {
        throw new Error('Text is required');
      }

      if (!parentId) {
        throw new Error('ParentId is required');
      }

      return new Event(COMMENT_CREATED, {
        text,
        parentId,
        userId
      });
    },
    updateComment: (state: any, command: CommentUpdated) => {
      const { text } = command.payload;

      throwIfAggregateIsNotExists(state, command);
      throwIfPermissionDenied(state, command);

      if (!text) {
        throw new Error('Text is required');
      }

      return new Event(COMMENT_UPDATED, {
        text
      });
    },
    removeComment: (state: any, command: CommentRemoved) => {
      throwIfAggregateIsNotExists(state, command);
      throwIfPermissionDenied(state, command);

      return new Event(COMMENT_REMOVED);
    }
  }
};
