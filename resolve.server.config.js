import path from 'path'
import busAdapter from 'resolve-bus-memory'
import storageAdapter from 'resolve-storage-lite'
import localStrategy from 'resolve-scripts/dist/server/auth/localStrategy'

import clientConfig from './resolve.client.config'
import aggregates from './common/aggregates'

import readModels from './common/read-models'
import viewModels from './common/view-models'

import localStrategyParams from './auth/localStrategy'

import {
  authenticationSecret,
  cookieName,
  cookieMaxAge
} from './auth/constants'

const databaseFilePath = path.join(__dirname, './storage.json')

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
  readModels,
  viewModels,
  jwt: {
    secret: authenticationSecret,
    cookieName,
    options: {
      maxAge: cookieMaxAge
    }
  },
  auth: {
    strategies: [localStrategy(localStrategyParams)]
  }
}
