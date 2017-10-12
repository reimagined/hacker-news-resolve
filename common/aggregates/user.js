// @flow
import { USER_CREATED } from '../events'
import { Event } from '../helpers'

export default {
  name: 'user',
  initialState: {},
  commands: {
    createUser: (state: any, command: any) => {
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
