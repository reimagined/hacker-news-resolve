/* @flow */

const events = {
    USER_CREATED: 'UserCreated',
    COMMENT_CREATED: 'CommentCreated',
    COMMENT_UPDATED: 'CommentUpdated',
    COMMENT_REMOVED: 'CommentRemoved',
};

export type UserCreated = {
    aggregateId: string;
    timestamp: string;
    payload: {
        name: string;
        passwordHash: string;
    };
};

export type CommentCreated = {
    aggregateId: string;
    timestamp: string;
    payload: {
        userId: string;
        text: string;
        parentId: string;
    };
};

export type CommentUpdated = {
    aggregateId: string;
    timestamp: string;
    payload: {
        userId: string;
        text: string;
    };
};

export type CommentRemoved = {
    aggregateId: string;
    timestamp: string;
    payload: {
        userId: string;
    }
};

export default events;
