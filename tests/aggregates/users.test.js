import '../../common/aggregates'
import users from '../../common/aggregates/user'
import { USER_CREATED } from '../../common/events'

describe('aggregates', () => {
  describe('users', () => {
    it('command "createUser" should create an event to create a user', () => {
      const name = 'SomeName'

      const state = {}
      const command = {
        payload: {
          name
        }
      }

      const event = users.commands.createUser(state, command)

      expect(event).toEqual({ type: USER_CREATED, payload: { name } })
    })

    it('command "createUser" should throw Error "User already exists"', () => {
      const name = 'SomeName'
      const passwordHash = 'SomePasswordHash'

      const state = {
        createdAt: Date.now()
      }
      const command = {
        payload: {
          name,
          passwordHash
        }
      }

      expect(() => users.commands.createUser(state, command)).toThrowError(
        'User already exists'
      )
    })

    it('command "createUser" should throw Error "Name is required"', () => {
      const name = undefined
      const passwordHash = 'SomePasswordHash'

      const state = {}
      const command = {
        payload: {
          name,
          passwordHash
        }
      }

      expect(() => users.commands.createUser(state, command)).toThrowError(
        'Name is required'
      )
    })

    it('eventHandler "USER_CREATED" should set new user to state', () => {
      const createdAt = Date.now()

      const state = users.initialState
      const event = {
        timestamp: createdAt
      }
      const nextState = {
        createdAt
      }

      expect(users.projection[USER_CREATED](state, event)).toEqual(nextState)
    })
  })
})
