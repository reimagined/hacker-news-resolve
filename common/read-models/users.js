import Immutable from '../immutable'

import type { UserCreated, PasswordChanged } from '../events/users'
import events from '../events/users'

const { USER_CREATED, PASSWORD_CHANGED } = events

export default {
  name: 'users',
  initialState: Immutable([]),
  eventHandlers: {
    [USER_CREATED]: (state: any, event: UserCreated) => {
      const { aggregateId, timestamp, payload: { name, passwordHash } } = event

      return state.concat({
        name,
        passwordHash,
        id: aggregateId,
        createdAt: timestamp,
        karma: 0
      })
    },

    [PASSWORD_CHANGED]: (state: any, event: PasswordChanged) => {
      const { aggregateId, payload: { newPassword } } = event
      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      return state.setIn([index, 'passwordHash'], newPassword)
    }
  },
  gqlSchema: `
    type User {
      id: ID!
      name: String
      createdAt: String
      karma: Int
    }
    type Query {
      users(aggregateId: ID!): [User]
    }
  `,
  gqlResolvers: {
    users: (root, args) => root
  }
}
