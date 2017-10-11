import events from '../events'
import { Event } from '../helpers'
import validate from '../validate'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: {},
  commands: {
    createUser: (state: any, command) => {
      const { name } = command.payload

      validate.checkAggregateIsNotExists(state, command)

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
