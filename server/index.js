import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

import { authorizationSecret } from '../common/constants'

export const getCurrentUser = async (executeQuery, cookies) => {
  try {
    const { id } = jwt.verify(cookies.authorizationToken, authorizationSecret)
    const [
      user
    ] = (await executeQuery(
      'users',
      'query ($id: ID!) { users(id: $id) { id, name, createdAt } }',
      { id }
    )).users

    return user
  } catch (error) {}
}

export const getUserByName = async (executeQuery, name) => {
  const [
    user
  ] = (await executeQuery(
    'users',
    'query ($name: String!) { users(name: $name) { id, name, createdAt } }',
    { name: name.trim() }
  )).users

  console.log(user)

  return user
}

export const extendExpress = express => {
  express.use('/api/commands/', authorizationMiddleware)

  function authorize(req, res, user) {
    try {
      const authorizationToken = jwt.sign(user, authorizationSecret, {
        noTimestamp: true
      })

      res.cookie('authorizationToken', authorizationToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365
      })

      res.redirect(req.query.redirect || '/')
    } catch (error) {
      res.redirect('/error/?text=Unauthorized')
    }
  }

  express.post(
    '/signup',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const user = await getUserByName(req.resolve.executeQuery, req.body.name)

      if (user) {
        res.redirect('/error/?text=User already exists')
        return
      }

      try {
        const user = {
          name: req.body.name.trim(),
          id: uuid.v4()
        }

        await req.resolve.executeCommand({
          type: 'createUser',
          aggregateId: user.id,
          aggregateName: 'users',
          payload: user
        })

        return authorize(req, res, user)
      } catch (error) {
        res.redirect(`/error/?text=${error.toString()}`)
      }
    }
  )

  express.post(
    '/login',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const user = await getUserByName(req.resolve.executeQuery, req.body.name)

      if (!user) {
        res.redirect('/error/?text=No such user')
        return
      }

      return authorize(req, res, user)
    }
  )
}

export const accessDenied = (req, res) => {
  res.status(401).send('401 Unauthorized')
}

export const authorizationMiddleware = (req, res, next) => {
  try {
    const user = jwt.verify(req.cookies.authorizationToken, authorizationSecret)
    if (!user) {
      throw new Error('Unauthorized')
    }
    req.body.userId = user.id
    next()
  } catch (error) {
    accessDenied(req, res)
  }
}

export const initialState = async (executeQuery, { cookies }) => {
  const user = await getCurrentUser(executeQuery, cookies)
  return {
    user: user || {},
    stories: [],
    comments: [],
    storyDetails: [],
    users: user ? [user] : []
  }
}
