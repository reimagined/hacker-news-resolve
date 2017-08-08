import Immutable from 'seamless-immutable';

import type { UserCreated, UserUpdated } from '../events/users';
import events from '../events/users';

const { USER_CREATED, USER_UPDATED } = events;

const checkPassword = (password) => {
    return (password && password.length > 4) ? password : false;
};

export default {
    name: 'users',
    initialState: Immutable({}),
    eventHandlers: {
        [USER_CREATED]: (state: any, event: UserCreated) => {
            const { name, password } = event.payload;
            return state.set(event.aggregateId, { name, password });
        },
        [USER_UPDATED]: (state: any, event: UserUpdated) => {
            const id = event.aggregateId;
            const { password } = event.payload;
            return (state[id] && checkPassword(password) ) ? 
                state.setIn([id, 'password'], password) : state;
        }
    }
};
