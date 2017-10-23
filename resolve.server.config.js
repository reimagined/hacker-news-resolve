import busDriver from 'resolve-bus-memory'
import storageDriver from 'resolve-storage-lite'

import clientConfig from './resolve.client.config'
import aggregates from './common/aggregates'
import * as events from './common/events'

import {
  collections as gqlCollections,
  resolvers as gqlResolvers,
  schema as gqlSchema
} from './common/read-models/graphql'

import extendExpress from './server/extendExpress'
import initialState from './server/initialState'

import {
  authorizationSecret,
  cookieName,
  cookieMaxAge,
  databaseFilePath
} from './server/constants'

const eventTypes = Object.keys(events).map(key => events[key])

export default {
  entries: clientConfig,
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
  readModels: [
    {
      name: 'graphql',
      projection: gqlCollections,
      gqlSchema,
      gqlResolvers
    }
  ],
  extendExpress,
  jwt: {
    secret: authorizationSecret,
    cookieName,
    options: {
      maxAge: cookieMaxAge
    }
  }
}
