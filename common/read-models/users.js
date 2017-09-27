import Immutable from 'seamless-immutable'

import type { UserCreated } from '../events/user'
import events from '../events/user'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: Immutable([]),
  eventHandlers: {
    [USER_CREATED]: (state: any, event: UserCreated) => {
      const { aggregateId, timestamp, payload: { name } } = event

      return state.concat({
        name,
        id: aggregateId,
        createdAt: timestamp
      })
    }
  },
  gqlSchema: `
    type User {
      id: ID!
      name: String
      createdAt: String
    }
    type Query {
      users(id: ID, name: String): [User]
    }
  `,
  gqlResolvers: {
    users: (root, { id, name }) => {
      const user = name
        ? root.find(user => name === user.name)
        : root.find(user => id === user.id)
      return user ? [user] : []
    }
  }
}
