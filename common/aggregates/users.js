import Immutable from 'seamless-immutable';

import type { UserCreated } from '../events/users';
import events from '../events/users';
import { Event } from '../helpers';

const { USER_CREATED } = events;

const Aggregate = {
    name: 'users',
    initialState: Immutable({}),
    eventHandlers: {
        [USER_CREATED]: (state, event) =>  state.set('createdAt', event.timestamp)
    },
    commands: {
        createUser: (state: any, command: UserCreated) => {
            if(state.createdAt) {
                throw new Error('User already exists')
            }
            return new Event(USER_CREATED, command.aggregateId, {
                name: command.payload.name,
                passwordHash: command.payload.passwordHash,
                id: command.aggregateId
            })
        }
    }
};

export default Aggregate;
