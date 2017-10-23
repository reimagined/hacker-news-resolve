import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

import { authorizationSecret, cookieName, cookieMaxAge } from './constants'

export const getUserByName = async (executeQuery, name) => {
  const { user } = await executeQuery(
    `query ($name: String!) {
      user(name: $name) {
        id,
        name,
        createdAt
      }
    }`,
    { name: name.trim() }
  )

  return user
}

export const authorize = (req, res, user) => {
  try {
    const authorizationToken = jwt.sign(user, authorizationSecret)
    res.cookie(cookieName, authorizationToken, {
      maxAge: cookieMaxAge
    })

    res.redirect(req.query.redirect || '/')
  } catch (error) {
    res.redirect('/error?text=Unauthorized')
  }
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

export default express => {
  express.use('/', authorizationMiddleware)
  express.use('/api/commands/', commandAuthorizationMiddleware)

  express.post(
    '/register',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const executeQuery = req.resolve.readModelExecutors.graphql

      const existingUser = await getUserByName(executeQuery, req.body.name)

      if (existingUser) {
        res.redirect('/error?text=User already exists')
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
          aggregateName: 'user',
          payload: user
        })

        return authorize(req, res, user)
      } catch (error) {
        res.redirect(`/error?text=${error.toString()}`)
      }
    }
  )

  express.post(
    '/login',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const user = await getUserByName(
        req.resolve.readModelExecutors.graphql,
        req.body.name
      )

      if (!user) {
        res.redirect('/error?text=No such user')
        return
      }

      return authorize(req, res, user)
    }
  )
}
