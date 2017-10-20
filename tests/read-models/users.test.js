import uuid from 'uuid'

import '../../common/read-models/graphql/collections'
import users from '../../common/read-models/graphql/collections/users'
import { USER_CREATED } from '../../common/events'

describe('read-models', () => {
  describe('users', () => {
    it('eventHandler "USER_CREATED" should create a comment', () => {
      const state = users.initialState

      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          name: 'SomeName'
        }
      }

      const nextState = [
        {
          name: event.payload.name,
          id: event.aggregateId,
          createdAt: event.timestamp
        }
      ]

      expect(users.projection[USER_CREATED](state, event)).toEqual(nextState)
    })
  })
})
