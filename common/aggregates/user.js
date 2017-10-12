import events from '../events'
import { Event } from '../helpers'

const { USER_CREATED } = events

export default {
  name: 'user',
  initialState: {},
  commands: {
    createUser: (state: any, command) => {
      if (state.createdAt !== undefined) {
        throw new Error('User already exists')
      }

      const { name } = command.payload

      if (!name) {
        throw new Error('Name is required')
      }

      return new Event(USER_CREATED, { name })
    }
  },
  projection: {
    [USER_CREATED]: (state, { timestamp }) => ({
      ...state,
      createdAt: timestamp
    })
  }
}
