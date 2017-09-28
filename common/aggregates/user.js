import Immutable from 'seamless-immutable'
import events from '../events'
import { Event } from '../helpers'
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: Immutable({}),
  commands: {
    createUser: (state: any, command) => {
      const { name } = command.payload

      throwIfAggregateAlreadyExists(state, command)

      if (!name) {
        throw new Error('Name is required')
      }

      return new Event(USER_CREATED, { name })
    }
  },
  projection: {
    [USER_CREATED]: (state, { timestamp }) => state.set('createdAt', timestamp)
  }
}
