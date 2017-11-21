import { createStore, applyMiddleware, compose } from 'redux'
import { sendCommandMiddleware, setSubscriptionMiddleware } from 'resolve-redux'
import Immutable from 'seamless-immutable'
import createSagaMiddleware from 'redux-saga'
import cookies from 'js-cookie'
import saga from '../sagas'

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

  cookies.remove('authenticationToken')
  window.location.reload()
}

const sagaMiddleware = createSagaMiddleware()

export default initialState => {
  const middleware = isClient
    ? [
        sendCommandMiddleware(),
        setSubscriptionMiddleware(),
        logoutMiddleware,
        sagaMiddleware
      ]
    : []

  const enhancer = composeEnhancers(applyMiddleware(...middleware))
  const store = createStore(reducer, Immutable(initialState), enhancer)
  if (typeof window === 'object') {
    sagaMiddleware.run(saga)
  }

  return store
}
