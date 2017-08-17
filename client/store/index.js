import axios from 'axios';
import { createStore, applyMiddleware, compose } from 'redux';
import { sendCommandMiddleware } from 'resolve-redux';
import createSagaMiddleware from 'redux-saga';
import Immutable from 'seamless-immutable';
import reducer from '../reducers';
import rootSaga from '../sagas';

const isClient = typeof window === 'object';

const composeEnhancers =
  isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default initialState => {
  const middleware = [];

  const sagaMiddleware = isClient && createSagaMiddleware();

  if (isClient) {
    middleware.push(
      sendCommandMiddleware({
        sendCommand: command => axios.post('/api/commands', command)
      }),
      sagaMiddleware
    );
  }

  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(reducer, Immutable(initialState), enhancer);

  if (isClient) {
    sagaMiddleware.run(rootSaga);
  }

  return store;
};
