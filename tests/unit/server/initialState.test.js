import uuid from 'uuid'
import jwt from 'jsonwebtoken'

import { authenticationSecret } from '../../../server/constants'
import initialState, { getCurrentUser } from '../../../server/initialState'

const currentUser = {
  name: 'SomeName',
  id: uuid.v4()
}

const executeQuery = (_, { id }) => ({
  user: id === currentUser.id ? currentUser : null
})

describe('server', () => {
  it('initialState should return initial state', async () => {
    const cookies = {
      authenticationToken: jwt.sign(currentUser, authenticationSecret)
    }

    const state = await initialState(
      {
        graphql: executeQuery
      },
      { cookies }
    )

    expect(state).toEqual({
      user: currentUser
    })
  })

  it('getCurrentUser should return current user', async () => {
    const cookies = {
      authenticationToken: jwt.sign(currentUser, authenticationSecret)
    }

    const user = await getCurrentUser(executeQuery, cookies)
    expect(user).toEqual(currentUser)
  })

  it('getCurrentUser should return null', async () => {
    const cookies = {}
    const user = await getCurrentUser(executeQuery, cookies)
    expect(user).toEqual(null)
  })
})
