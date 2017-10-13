// @flow
import { USER_CREATED } from '../events'

type User = {
  id: string,
  name: string,
  createdAt: number
}

type UsersState = Array<User>

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
