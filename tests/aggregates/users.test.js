import '../../common/aggregates';
import users from '../../common/aggregates/users';
import events from '../../common/events';
import { Event } from '../../common/helpers';

const { USER_CREATED } = events;

describe('aggregates', () => {
  describe('users', () => {
    it('command "createUser" should create an event to create a user', () => {
      const name = 'SomeName';
      const passwordHash = 'SomePasswordHash';

      const state = {};
      const command = {
        payload: {
          name,
          passwordHash
        }
      };

      const event = users.commands.createUser(state, command);

      expect(event).toEqual(
        new Event(USER_CREATED, {
          name,
          passwordHash
        })
      );
    });

    it('command "createUser" should throw Error "Aggregate already exists"', () => {
      const name = 'SomeName';
      const passwordHash = 'SomePasswordHash';

      const state = {
        createdAt: Date.now()
      };
      const command = {
        payload: {
          name,
          passwordHash
        }
      };

      expect(() => users.commands.createUser(state, command)).toThrowError(
        'Aggregate already exists'
      );
    });

    it('command "createUser" should throw Error "Name is required"', () => {
      const name = undefined;
      const passwordHash = 'SomePasswordHash';

      const state = {};
      const command = {
        payload: {
          name,
          passwordHash
        }
      };

      expect(() => users.commands.createUser(state, command)).toThrowError(
        'Name is required'
      );
    });

    it('command "createUser" should throw Error "PasswordHash is required"', () => {
      const name = 'SomeName';
      const passwordHash = undefined;

      const state = {};
      const command = {
        payload: {
          name,
          passwordHash
        }
      };

      expect(() => users.commands.createUser(state, command)).toThrowError(
        'PasswordHash is required'
      );
    });

    it('eventHandler "USER_CREATED" should set createdAt to state', () => {
      const createdAt = Date.now();

      const state = users.initialState;
      const event = {
        timestamp: createdAt
      };
      const nextState = {
        createdAt
      };

      expect(users.eventHandlers[USER_CREATED](state, event)).toEqual(
        nextState
      );
    });
  });
});
