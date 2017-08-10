import Immutable from 'seamless-immutable';

import type { UserCreated } from '../events/users';
import events from '../events/users';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';

const { USER_CREATED } = events;

export default  {
    name: 'users',
    initialState: Immutable({}),
    eventHandlers: {
        [USER_CREATED]: (state, event) =>  state.set('createdAt', event.timestamp)
    },
    commands: {
        createUser: (state: any, command: UserCreated) => {
            const { name, passwordHash } = command.payload;

            throwIfAggregateAlreadyExists(state, command);

            if (!name) {
                throw new Error('UserId is required');
            }

            if (!passwordHash) {
                throw new Error('PasswordHash is required');
            }

            return new Event(USER_CREATED, {
                name,
                passwordHash
            });
        }
    }
};
