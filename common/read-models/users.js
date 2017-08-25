import Immutable from '../immutable';

import type { UserCreated, PasswordChanged } from '../events/users';
import events from '../events/users';

const { USER_CREATED, PASSWORD_CHANGED } = events;

export default {
  name: 'users',
  initialState: Immutable({}),
  eventHandlers: {
    [USER_CREATED]: (state: any, event: UserCreated) => {
      const { aggregateId, timestamp, payload: { name, passwordHash } } = event;

      return state.set(aggregateId, {
        name,
        passwordHash,
        id: aggregateId,
        createdAt: timestamp,
        karma: 0
      });
    },
    [PASSWORD_CHANGED]: (state: any, event: PasswordChanged) => {
      const { aggregateId, payload: { newPassword } } = event;

      return state.setIn([aggregateId, 'passwordHash'], newPassword);
    }
  }
};
