import Immutable from '../immutable'

import type { UserCreated } from '../events/users'
import events from '../events/users'

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
        createdAt: timestamp,
        karma: 0
      })
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
