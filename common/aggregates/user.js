// @flow
import Immutable from 'seamless-immutable'
import { USER_CREATED } from '../events'
import { Event } from '../helpers'
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists'

export default {
  name: 'users',
  initialState: Immutable({}),
  commands: {
    createUser: (state: any, command: any) => {
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
