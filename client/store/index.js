import axios from 'axios';
import { createStore, applyMiddleware, compose } from 'redux';
import { sendCommandMiddleware } from 'resolve-redux';
import reducer from '../reducers';

const middleware = [sendCommandMiddleware({
    sendCommand: async command => axios.post(`${window.__ROOT_DIRECTORY__}/api/commands`, command)
})];

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
);

export default (initialState) => createStore(reducer, initialState, enhancer);
