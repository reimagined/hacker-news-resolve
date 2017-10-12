import { createStore, applyMiddleware, compose } from 'redux'
import { sendCommandMiddleware, setSubscriptionMiddleware } from 'resolve-redux'
import Immutable from 'seamless-immutable'
import cookies from 'js-cookie'

import reducer from '../reducers'

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

  cookies.remove('authorizationToken')
  window.location.reload()
}

export default initialState => {
  const middleware = isClient
    ? [sendCommandMiddleware(), setSubscriptionMiddleware(), logoutMiddleware]
    : []

  const enhancer = composeEnhancers(applyMiddleware(...middleware))
  return createStore(reducer, Immutable(initialState), enhancer)
}
