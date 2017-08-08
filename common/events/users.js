/* @flow */

const events = {
    USER_CREATED: 'UserCreated',
    USER_UPDATED: 'UserUpdated'
};

export type UserCreated = {
    aggregateId: string;
    payload: {
        name: string;
        password: string;
    };
};

export type UserUpdated = {
    aggregateId: string;
    payload: {
        password: string;
    };
};

export default events;
