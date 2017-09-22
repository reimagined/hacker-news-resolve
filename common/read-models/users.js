import Immutable from 'seamless-immutable'

import type { UserCreated } from '../events/users'
import events from '../events/users'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: Immutable([]),
  eventHandlers: {
    [USER_CREATED]: (state: any, event: UserCreated) => {
      const { aggregateId, timestamp, payload: { name } } = event

      return state.concat({
        name,
        id: aggregateId,
        createdAt: timestamp
      })
    }
  }
}
