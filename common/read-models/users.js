// @flow
import Immutable from 'seamless-immutable'

import type { Event, UserCreated } from '../events'
import { USER_CREATED } from '../events'

export default {
  name: 'users',
  initialState: Immutable([]),
  eventHandlers: {
    [USER_CREATED]: (
      state: UsersReadModel,
      event: UserCreated
    ): UsersReadModel => {
      const { aggregateId, timestamp, payload: { name } } = event

      return state.concat({
        id: aggregateId,
        name,
        createdAt: timestamp
      })
    }
  }
}
