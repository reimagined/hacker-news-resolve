import jwt from 'jsonwebtoken'

import { authorizationSecret, cookieName } from './constants'

export const getCurrentUser = async (executeQuery, cookies) => {
  try {
    const { id } = jwt.verify(cookies[cookieName], authorizationSecret)

    if (!id) {
      return null
    }

    const { user } = await executeQuery(
      `query ($id: ID!) {
        user(id: $id) {
          id,
          name,
          createdAt
        }
      }`,
      { id }
    )

    return user
  } catch (error) {
    return null
  }
}

export default async (readModelExecutors, { cookies }) => {
  const executeQuery = readModelExecutors.graphql
  const user = await getCurrentUser(executeQuery, cookies)

  return {
    user: user || {}
  }
}
