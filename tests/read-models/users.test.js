import uuid from 'uuid'

import '../../common/read-models'
import users from '../../common/read-models/users'
import events from '../../common/events'

const { USER_CREATED } = events

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

      expect(users.eventHandlers[USER_CREATED](state, event)).toEqual(nextState)
    })

    it('gqlResolver with name', () => {
      const root = [{ name: 'user-1' }, { name: 'user-2' }]

      const result = users.gqlResolvers.users(root, { name: 'user-1' })
      expect(result).toEqual([
        {
          name: 'user-1'
        }
      ])
    })

    it('gqlResolver with id', () => {
      const root = [
        { name: 'user-1', id: 'id-1' },
        { name: 'user-2', id: 'id-1' }
      ]

      const result = users.gqlResolvers.users(root, { id: 'id-1' })
      expect(result).toEqual([
        {
          name: 'user-1',
          id: 'id-1'
        }
      ])
    })

    it('gqlResolver unknown user', () => {
      const root = [{ name: 'user-1' }]

      const result = users.gqlResolvers.users(root, { name: 'user-2' })
      expect(result).toEqual([])
    })
  })
})
