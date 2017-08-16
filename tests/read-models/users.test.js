import uuid from 'uuid';

import '../../common/read-models';
import users from '../../common/read-models/users';
import events from '../../common/events';

const { USER_CREATED } = events;

describe('read-models', () => {
  describe('users', () => {
    it('eventHandler "USER_CREATED" should create a comment', () => {
      const state = users.initialState;
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          name: 'SomeName',
          passwordHash: 'SomePasswordHash'
        }
      };

      const nextState = {
        [event.aggregateId]: {
          name: event.payload.name,
          passwordHash: event.payload.passwordHash,
          id: event.aggregateId,
          createdAt: event.timestamp,
          karma: 0
        }
      };

      expect(users.eventHandlers[USER_CREATED](state, event)).toEqual(
        nextState
      );
    });
  });
});
