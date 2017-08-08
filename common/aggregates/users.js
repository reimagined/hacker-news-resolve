import Immutable from 'seamless-immutable';

import type { UserCreated, UserUpdated } from '../events/users';
import events from '../events/users';

const { USER_CREATED, USER_UPDATED } = events;

const Event = (type, payload) => ({
    type,
    payload
});

const throwErrorIfEmpty = (value, name) => {
    if(value === null) {
        throw new Error(`${name ? name : 'Value'} should not be empty`);
    }
}

const Aggregate = {
    name: 'users',
    initialState: Immutable({}),
    commands: {
        createUser: (state: any, command: UserCreated) =>
            new Event(USER_CREATED, {
                name: command.payload.name,
                password: command.payload.password
            }),
        updateUser: (state: any, command: UserUpdated) => {
            const { password } = command.payload;
            throwErrorIfEmpty(password);
            return new Event(USER_UPDATED, { password });
        }
    }
};

export default Aggregate;
