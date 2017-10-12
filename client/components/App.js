import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const networkInterface = createNetworkInterface({ uri: '/api/graphql' })
const client = new ApolloClient({ networkInterface })
const isServer = typeof window === 'undefined'

const App = () => {
  const children = (
    <ApolloProvider client={client}>
      <RouteWithSubRoutes routes={routes} />
    </ApolloProvider>
  )

  return isServer ? (
    <StaticRouter>{children}</StaticRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  )
}

export default App
