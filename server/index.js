import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import uuid from 'uuid'

import {
  authorizationSecret,
  cookieName,
  cookieMaxAge
} from '../common/constants'

export const getCurrentUser = async (executeQuery, cookies) => {
  try {
    const { id } = jwt.verify(cookies[cookieName], authorizationSecret)
    const {
      users
    } = await executeQuery(
      'query ($id: ID!) { users(id: $id) { id, name, createdAt } }',
      { id }
    )
    const [user] = users

    return user
  } catch (error) {}
}

export const getUserByName = async (executeQuery, name) => {
  const {
    users
  } = await executeQuery(
    'query ($name: String!) { users(name: $name) { id, name, createdAt } }',
    { name: name.trim() }
  )
  const [user] = users

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
    res.redirect('/error/?text=Unauthorized')
  }
}

export const extendExpress = express => {
  express.use('/', authorizationMiddleware)
  express.use('/api/commands/', commandAuthorizationMiddleware)

  express.post(
    '/signup',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const existingUser = await getUserByName(
        req.resolve.executeQuery,
        req.body.name
      )

      if (existingUser) {
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

  express.post(
    '/graphql',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const query = encodeURIComponent(req.body.query)
      const variables = encodeURIComponent(JSON.stringify(req.body.variables))
      const url = `http://localhost:3000/api/query?graphql=${query}&variables=${variables}`
      const result = await fetch(url)
      const data = await result.json()
      res.send({ data })
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
