import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import uuid from 'uuid'

import { authorizationSecret } from '../common/constants'

export const extendExpress = express => {
  express.use(passport.initialize())
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'name',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
      },
      function(req, name, password, done) {
        const passwordHash = crypto
          .createHmac('sha256', authorizationSecret)
          .update(password)
          .digest('hex')
        return done(null, {
          name,
          passwordHash
        })
      }
    )
  )

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

  express.get(
    '/signup',
    passport.authenticate('local', {
      failureRedirect: '/error/?text=Unauthorized'
    }),
    async (req, res) => {
      const users = await req.resolve.executeQuery('users')
      const existingUser = users.find(({ name }) => name === req.user.name)

      if (existingUser) {
        res.redirect('/error/?text=User already exists')
        return
      }

      try {
        const user = {
          ...req.user,
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

  express.get(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/error/?text=Unauthorized'
    }),
    async (req, res) => {
      const users = await req.resolve.executeQuery('users')
      const user = users.find(({ name }) => name === req.user.name)

      if (!user) {
        res.redirect('/error/?text=No such user')
        return
      }

      if (user.passwordHash !== req.user.passwordHash) {
        res.redirect('/error/?text=Incorrect Username or Password')
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

export const initialState = async (queries, executeQuery, { cookies }) => {
  let user

  try {
    const users = await executeQuery('users')
    const { id } = jwt.verify(cookies.authorizationToken, authorizationSecret)
    user = users.find(u => u.id === id)
  } catch (error) {
    user = {}
  }

  const resultOfQueries = queries.map(({ name, initialState }) => {
    const state = initialState
    return { state, name }
  })

  return resultOfQueries.reduce(
    (result, { state, name }) => {
      result[name] = state
      return result
    },
    { user }
  )
}
