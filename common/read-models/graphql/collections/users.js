// @flow
import { USER_CREATED } from '../../../events'
import type { Event, UserCreated } from '../../../../flow-types/events'

type User = {
  id: string,
  name: string,
  createdAt: number
}

type UsersState = Array<User>

export default {
  name: 'users',
  initialState: [],
  projection: {
    [USER_CREATED]: (
      state: UsersState,
      { aggregateId, timestamp, payload: { name } }: Event<UserCreated>
    ): UsersState => {
      state.push({
        id: aggregateId,
        name,
        createdAt: timestamp
      })
      return state
    }
  }
}
