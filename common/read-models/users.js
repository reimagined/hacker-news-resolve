// @flow
import type { Event, UserCreated } from '../events'
import { USER_CREATED } from '../events'

export default {
  name: 'users',
  initialState: [],
  eventHandlers: {
    [USER_CREATED]: (
      state: UsersReadModel,
      event: UserCreated
    ): UsersReadModel => {
      const { aggregateId, timestamp, payload: { name } } = event

      state.push({
        name,
        id: aggregateId,
        name,
        createdAt: timestamp
      })
      return state
    }
  }
}
