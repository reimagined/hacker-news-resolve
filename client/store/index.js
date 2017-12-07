import { createStore, applyMiddleware, compose } from 'redux'
import { resolveMiddleware, actionTypes } from 'resolve-redux'
import Immutable from 'seamless-immutable'
import cookies from 'js-cookie'
import viewModels from '../../common/view-models'

import reducer from '../reducers'

const { SEND_COMMAND } = actionTypes

const isClient = typeof window === 'object'

const composeEnhancers =
  isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

const logoutMiddleware = () => next => action => {
  if (action.type !== 'USER_LOGOUT') {
    next(action)
    return
  }

  cookies.remove('authenticationToken')
  window.location.reload()
}

const storyCreateMiddleware = () => next => action => {
  switch (action.type) {
    case SEND_COMMAND: {
      if (action.command.type === 'createStory') {
        if (action.command.ok) {
          window.location = `/storyDetails/${action.aggregateId}`
        } else if (action.command.error) {
          window.location = '/error?text=Failed to create a story'
        }
      }
      break
    }
  }
  next(action)
}

export default initialState => {
  const middleware = isClient
    ? [resolveMiddleware(viewModels), logoutMiddleware, storyCreateMiddleware]
    : []

  const enhancer = composeEnhancers(applyMiddleware(...middleware))
  return createStore(reducer, Immutable(initialState), enhancer)
}
