/* @flow */

const events = {
  USER_CREATED: 'UserCreated'
};

export type UserCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    name: string,
    passwordHash: string
  }
};

export default events;
