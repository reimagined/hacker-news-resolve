import busAdapter from 'resolve-bus-memory'
import storageAdapter from 'resolve-storage-lite'

import clientConfig from './resolve.client.config'
import aggregates from './common/aggregates'
import * as events from './common/events'

import readModels from './common/read-models'
import viewModels from './common/view-models'

import extendExpress from './server/extendExpress'

import {
  authenticationSecret,
  cookieName,
  cookieMaxAge,
  databaseFilePath
} from './server/constants'

const eventTypes = Object.keys(events).map(key => events[key])

const storageAdapterParams = process.env.IS_TEST
  ? {}
  : { pathToFile: databaseFilePath }

export default {
  entries: clientConfig,
  bus: { adapter: busAdapter },
  storage: {
    adapter: storageAdapter,
    params: storageAdapterParams
  },
  aggregates,
  initialSubscribedEvents: {
    types: eventTypes,
    ids: []
  },
  readModels,
  viewModels,
  extendExpress,
  jwt: {
    secret: authenticationSecret,
    cookieName,
    options: {
      maxAge: cookieMaxAge
    }
  }
}
