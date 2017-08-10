import Immutable from 'seamless-immutable';

import type { CommentCreated, CommentUpdated, CommentRemoved } from '../events/users';
import events from '../events/users';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import throwIfAggregateIsNotExists from './validators/throwIfAggregateIsNotExists';
import throwIfPermissionDenied from './validators/throwIfPermissionDenied';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

export default  {
    name: 'comments',
    initialState: Immutable({}),
    eventHandlers: {
        [COMMENT_CREATED]: (state, event) => state.merge({
            createdAt: event.timestamp,
            createdBy: event.user.id
        }),
        [COMMENT_REMOVED]: (state, event) => state.set('removedAt', event.timestamp)
    },
    commands: {
        createComment: (state: any, command: CommentCreated) => {
            throwIfAggregateAlreadyExists(state, command);

            return new Event(COMMENT_CREATED, {
                text: command.payload.text,
                parentId: command.payload.parentId
            });
        },
        updateComment: (state: any, command: CommentUpdated) => {
            throwIfAggregateIsNotExists(state, command);
            throwIfPermissionDenied(state, command);

            return new Event(COMMENT_UPDATED, {
                text: command.payload.text,
            });
        },
        removeComment: (state: any, command: CommentRemoved) => {
            throwIfAggregateIsNotExists(state, command);
            throwIfPermissionDenied(state, command);

            return new Event(COMMENT_REMOVED, {});
        }
    }
};
