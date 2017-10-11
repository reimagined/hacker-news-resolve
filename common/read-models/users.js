import type { Event, UserCreated } from '../events'
import events from '../events'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: [],
  eventHandlers: {
    [USER_CREATED]: (state: any, event: Event<UserCreated>) => {
      const { aggregateId, timestamp, payload: { name } } = event

      state.push({
        name,
        id: aggregateId,
        createdAt: timestamp
      })
      return state
    }
  }
}
