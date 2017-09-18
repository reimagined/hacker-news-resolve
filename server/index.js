import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

import { authorizationSecret, cookieName } from '../common/constants'

export const extendExpress = express => {
  express.use('/', authorizationMiddleware)
  express.use('/api/commands/', commandAuthorizationMiddleware)

  function authorize(req, res, user) {
    try {
      const authorizationToken = jwt.sign(user, authorizationSecret)
      res.cookie(cookieName, authorizationToken)

      res.redirect(req.query.redirect || '/')
    } catch (error) {
      res.redirect('/error/?text=Unauthorized')
    }
  }

  express.post(
    '/signup',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const users = await req.resolve.executeQuery('users')
      const existingUser = users.find(({ name }) => name === req.body.name)

      if (existingUser) {
        res.redirect('/error/?text=User already exists')
        return
      }

      try {
        const user = {
          name: req.body.name,
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
      const users = await req.resolve.executeQuery('users')
      const user = users.find(({ name }) => name === req.body.name)

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

const authorizationMiddleware = (req, res, next) => {
  req.getJwt((_, user) => {
    if (user) {
      req.body.userId = user.id
    }
    next()
  })
}

export const commandAuthorizationMiddleware = (req, res, next) => {
  try {
    const user = req.getJwt()
    if (!user) {
      throw new Error('Unauthorized')
    }
    req.body.userId = user.id
    next()
  } catch (error) {
    accessDenied(req, res)
  }
}

export const getCurrentUser = async (executeQuery, { body }) => {
  try {
    const users = await executeQuery('users')
    const id = body.userId
    return users.find(user => user.id === id) || {}
  } catch (error) {
    return {}
  }
}

export const initialState = async (executeQuery, params) => {
  const user = await getCurrentUser(executeQuery, params)
  return {
    user,
    stories: [],
    comments: [],
    storyDetails: [],
    users: [user]
  }
}
