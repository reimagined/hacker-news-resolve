// @flow
import { USER_CREATED } from '../events'
import validate from './validation'

export default {
  name: 'user',
  initialState: {},
  commands: {
    createUser: (state: any, command: any) => {
      validate.stateIsAbsent(state, 'User')

      const { name } = command.payload

      validate.fieldRequired(command.payload, 'name')

      const payload: UserCreatedPayload = { name }
      return { type: USER_CREATED, payload }
    }
  },
  projection: {
    [USER_CREATED]: (state, { timestamp }) => ({
      ...state,
      createdAt: timestamp
    })
  }
}
