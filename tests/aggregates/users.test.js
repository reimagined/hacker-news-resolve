import crypto from 'crypto';
import { authorizationSecret } from '../../common/constants';
import '../../common/aggregates';
import users from '../../common/aggregates/users';
import events from '../../common/events';
import { Event } from '../../common/helpers';

const { USER_CREATED, PASSWORD_CHANGED } = events;

const getHash = password =>
  crypto
    .createHmac('sha256', authorizationSecret)
    .update(password)
    .digest('hex');

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

    it('eventHandler "USER_CREATED" should set new user to state', () => {
      const createdAt = Date.now();
      const passwordHash = 'password-hash';

      const state = users.initialState;
      const event = {
        timestamp: createdAt,
        payload: { passwordHash }
      };
      const nextState = {
        createdAt,
        password: passwordHash
      };

      expect(users.eventHandlers[USER_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('command "changePassword" should create an event to change password', () => {
      const currentPassword = 'test-password';
      const newPassword = 'test-password-1';

      const currentPasswordHash = getHash(currentPassword);
      const newPasswordHash = getHash(newPassword);

      const state = { password: currentPasswordHash };

      const command = {
        payload: {
          currentPassword,
          newPassword
        }
      };

      const event = users.commands.changePassword(state, command);

      expect(event).toEqual(
        new Event(PASSWORD_CHANGED, {
          newPassword: newPasswordHash
        })
      );
    });

    it('command "changePassword" should throw Error "Current password is incorrect"', () => {
      const currentPassword = 'test-password';
      const fakeCurrentPassword = 'fake-current-password';
      const newPassword = 'test-password-1';

      const currentPasswordHash = getHash(currentPassword);

      const state = { password: currentPasswordHash };

      const command = {
        payload: {
          currentPassword: fakeCurrentPassword,
          newPassword
        }
      };

      expect(() => users.commands.changePassword(state, command)).toThrowError(
        'Current password is incorrect'
      );
    });

    it('command "changePassword" should throw Error "New password should be different from current password"', () => {
      const currentPassword = 'test-password';
      const newPassword = 'test-password';

      const currentPasswordHash = getHash(currentPassword);

      const state = { password: currentPasswordHash };

      const command = {
        payload: {
          currentPassword,
          newPassword
        }
      };

      expect(() => users.commands.changePassword(state, command)).toThrowError(
        'New password should be different from current password'
      );
    });

    it('command "changePassword" should throw Error "New password is empty"', () => {
      const currentPassword = 'test-password';
      const newPassword = '';

      const currentPasswordHash = getHash(currentPassword);

      const state = { password: currentPasswordHash };

      const command = {
        payload: {
          currentPassword,
          newPassword
        }
      };

      expect(() => users.commands.changePassword(state, command)).toThrowError(
        'New password is empty'
      );
    });

    it('eventHandler "PASSWORD_CHANGED" should set new password to state', () => {
      const newPassword = 'test-password-1';
      let state = users.initialState;

      const nextState = {
        password: newPassword
      };

      const event = {
        payload: { newPassword }
      };

      expect(users.eventHandlers[PASSWORD_CHANGED](state, event)).toEqual(
        nextState
      );
    });
  });
});
