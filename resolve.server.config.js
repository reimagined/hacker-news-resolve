import busDriver from 'resolve-bus-memory'
import storageDriver from 'resolve-storage-lite'

import { serverRootComponent } from './client/components/App'
import createStore from './client/store'
import aggregates from './common/aggregates'
import queries from './common/read-models'
import events from './common/events'
import createMemoryAdapter from './common/read-models/createMemoryAdapter'
import gqlSchema from './common/read-models/gqlSchema'
import gqlResolvers from './common/read-models/gqlResolvers'
import { extendExpress, initialState } from './server'
import {
  authorizationSecret,
  cookieName,
  cookieMaxAge
} from './common/constants'

const eventTypes = Object.keys(events).map(key => events[key])

export default {
  entries: {
    createStore,
    rootComponent: serverRootComponent
  },
  bus: { driver: busDriver },
  storage: {
    driver: storageDriver,
    params: { pathToFile: './storage.json' }
  },
  initialState,
  aggregates,
  initialSubscribedEvents: {
    types: eventTypes,
    ids: []
  },
  readModel: {
    projection: queries,
    adapter: createMemoryAdapter(),
    gqlSchema,
    gqlResolvers
  },
  extendExpress,
  jwt: {
    secret: authorizationSecret,
    cookieName,
    options: {
      maxAge: cookieMaxAge
    }
  }
}
