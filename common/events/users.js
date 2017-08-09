/* @flow */

const events = {
    USER_CREATED: 'UserCreated',
};

export type UserCreated = {
    aggregateId: string;
    payload: {
        name: string;
        passwordHash: string;
        id: string;
    };
};

export default events;
