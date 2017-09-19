import sinon from 'sinon'
import uuid from 'uuid'
import jwt from 'jsonwebtoken'

import { authorizationSecret } from '../../common/constants'
import { initialState, getCurrentUser } from '../../server'

const currentUser = {
  name: 'SomeName',
  passwordHash: 'SomePasswordHash',
  id: uuid.v4()
}

const executeQuery = sinon.spy(async queryName => {
  switch (queryName) {
    case 'users':
      return { users: [currentUser] }
    default:
      throw new Error()
  }
})

describe('server', () => {
  it('initialState should return initial state', async () => {
    const cookies = {
      authorizationToken: jwt.sign(currentUser, authorizationSecret)
    }

    const state = await initialState(executeQuery, { cookies })

    expect(state).toEqual({
      user: currentUser,
      stories: [],
      comments: [],
      storyDetails: [],
      users: [currentUser]
    })
  })

  it('getCurrentUser should return current user', async () => {
    const cookies = {
      authorizationToken: jwt.sign(currentUser, authorizationSecret)
    }

    const user = await getCurrentUser(executeQuery, cookies)

    expect(user).toEqual(currentUser)
  })

  it('getCurrentUser should return undefined', async () => {
    const cookies = {}

    const user = await getCurrentUser(executeQuery, cookies)

    expect(user).toEqual(undefined)
  })
})
