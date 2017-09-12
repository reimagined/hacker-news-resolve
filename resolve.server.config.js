import storageDriver from 'resolve-storage-file'
import busDriver from 'resolve-bus-memory'

import { serverRootComponent } from './client/components/App'
import createStore from './client/store'
import aggregates from './common/aggregates'
import queries from './common/read-models'
import events from './common/events'
import { extendExpress, initialState } from './server'

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
  initialState: (...args) => initialState(queries, ...args),
  aggregates,
  initialSubscribedEvents: {
    types: eventTypes,
    ids: []
  },
  queries,
  extendExpress
}
