import Immutable from 'seamless-immutable';

import type { UserCreated, UserUpdated } from '../events/users';
import events from '../events/users';
import { Event } from '../helpers';

const { USER_CREATED, USER_UPDATED } = events;

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
            new Event(USER_CREATED, command.aggregateId, {
                name: command.payload.name,
                password: command.payload.password
            }),
        updateUser: (state: any, command: UserUpdated) => {
            const { password } = command.payload;
            throwErrorIfEmpty(password);
            return new Event(USER_UPDATED, command.aggregateId, { password });
        }
    }
};

export default Aggregate;
