import Immutable from 'seamless-immutable';

import type { UserCreated } from '../events/users';
import events from '../events/users';

const { USER_CREATED } = events;

export default {
    name: 'users',
    initialState: Immutable({}),
    eventHandlers: {
        [USER_CREATED]: (state: any, event: UserCreated) => {
            return state.set(event.aggregateId, {
                ...event.payload,
                id: event.aggregateId
            });
        }
    }
};
