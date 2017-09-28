import Immutable from 'seamless-immutable'

import type { Event, UserCreated } from '../events'
import events from '../events'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: Immutable([]),
  eventHandlers: {
    [USER_CREATED]: (state: any, event: Event<UserCreated>) => {
      const { aggregateId, timestamp, payload: { name } } = event

      return state.concat({
        name,
        id: aggregateId,
        createdAt: timestamp
      })
    }
  }
}
