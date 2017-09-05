import sinon from 'sinon'
import uuid from 'uuid'
import jwt from 'jsonwebtoken'

import { authorizationSecret } from '../../common/constants'
import { initialState } from '../../server'

const user = {
  name: 'SomeName',
  passwordHash: 'SomePasswordHash',
  id: uuid.v4()
}

const queries = []

const executeQuery = sinon.spy(async queryName => {
  switch (queryName) {
    case 'users':
      return [user]
    default:
      throw new Error()
  }
})

describe('server', () => {
  it('initialState should return initialState for the authorized user', async () => {
    const cookies = {
      authorizationToken: jwt.sign(user, authorizationSecret)
    }

    const state = await initialState(queries, executeQuery, { cookies })

    expect(state).toEqual({
      user
    })
  })

  it('initialState should return initialState for the unauthorized user', async () => {
    const cookies = {}

    const state = await initialState(queries, executeQuery, { cookies })

    expect(state).toEqual({
      user: {}
    })
  })
})
