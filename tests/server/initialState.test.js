import sinon from 'sinon'
import uuid from 'uuid'
import jwt from 'jsonwebtoken'

import { authorizationSecret } from '../../common/constants'
import { initialState, getCurrentUser } from '../../server'

const userId = uuid.v4()
const currentUser = {
  name: 'SomeName',
  passwordHash: 'SomePasswordHash',
  id: userId
}

const executeQuery = sinon.spy(async queryName => {
  switch (queryName) {
    case 'users':
      return [currentUser]
    default:
      throw new Error()
  }
})

describe('server', () => {
  it('initialState should return initial state', async () => {
    const body = {
      userId
    }

    const state = await initialState(executeQuery, { body })

    expect(state).toEqual({
      user: currentUser,
      stories: [],
      comments: [],
      storyDetails: [],
      users: [currentUser]
    })
  })

  it('getCurrentUser should return current user', async () => {
    const body = {
      userId
    }

    const user = await getCurrentUser(executeQuery, { body })

    expect(user).toEqual(currentUser)
  })

  it('getCurrentUser should return empty object', async () => {
    const body = {}

    const user = await getCurrentUser(executeQuery, { body })

    expect(user).toEqual({})
  })
})
