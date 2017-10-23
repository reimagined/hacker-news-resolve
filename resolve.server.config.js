import busDriver from 'resolve-bus-memory'
import storageDriver from 'resolve-storage-lite'

import rootComponent from './client/components/App'
import createStore from './client/store'
import aggregates from './common/aggregates'
import * as events from './common/events'

import readModels from './common/read-models'

import { extendExpress, initialState } from './server'

import {
  authorizationSecret,
  cookieName,
  cookieMaxAge,
  databaseFilePath
} from './common/constants'

const eventTypes = Object.keys(events).map(key => events[key])

export default {
  entries: {
    createStore,
    rootComponent
  },
  bus: { driver: busDriver },
  storage: {
    driver: storageDriver,
    params: { pathToFile: databaseFilePath }
  },
  initialState,
  aggregates,
  initialSubscribedEvents: {
    types: eventTypes,
    ids: []
  },
  readModels,
  extendExpress,
  jwt: {
    secret: authorizationSecret,
    cookieName,
    options: {
      maxAge: cookieMaxAge
    }
  }
}
