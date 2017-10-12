// @flow
import type { Event, UserCreated } from '../events'
import { USER_CREATED } from '../events'

type UsersState = Array<{
  id: string,
  name: string,
  createdAt: number
}>

export default {
  name: 'users',
  initialState: [],
  eventHandlers: {
    [USER_CREATED]: (state: UsersState, event: UserCreated): UsersState => {
      const { aggregateId, timestamp, payload: { name } } = event

      state.push({
        id: aggregateId,
        name,
        createdAt: timestamp
      })
      return state
    }
  }
}
