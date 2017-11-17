import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

import { authenticationSecret, cookieName, cookieMaxAge } from './constants'

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

export const authenticate = (req, res, user) => {
  try {
    const authenticationToken = jwt.sign(user, authenticationSecret)
    res.cookie(cookieName, authenticationToken, {
      maxAge: cookieMaxAge
    })

    res.redirect(req.query.redirect || '/')
  } catch (error) {
    res.redirect('/error?text=Unauthenticated')
  }
}

export const accessDenied = (req, res) => {
  res.status(401).send('401 Unauthenticated')
}

const authenticationMiddleware = (req, res, next) => {
  req.getJwt((_, user) => {
    if (user) {
      req.body.userId = user.id
    }
    next()
  })
}

export const commandAuthenticationMiddleware = (req, res, next) => {
  try {
    const user = req.getJwt()
    if (!user) {
      throw new Error('Unauthenticated')
    }
    req.body.userId = user.id
    next()
  } catch (error) {
    accessDenied(req, res)
  }
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

export default express => {
  express.use('/', authenticationMiddleware)
  express.use('/api/commands/', commandAuthenticationMiddleware)

  express.post(
    '/register',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const executeQuery = req.resolve.queryExecutors.graphql

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

        return authenticate(req, res, user)
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
        req.resolve.queryExecutors.graphql,
        req.body.name
      )

      if (!user) {
        res.redirect('/error?text=No such user')
        return
      }

      return authenticate(req, res, user)
    }
  )
}
