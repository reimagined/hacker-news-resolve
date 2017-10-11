import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const networkInterface = createNetworkInterface({ uri: '/api/graphql' })
const client = new ApolloClient({ networkInterface })

export const clientRootComponent = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <RouteWithSubRoutes routes={routes} />
    </BrowserRouter>
  </ApolloProvider>
)

export const serverRootComponent = props => (
  <ApolloProvider client={client}>
    <StaticRouter location={props.url} context={{}}>
      <RouteWithSubRoutes routes={routes} />
    </StaticRouter>
  </ApolloProvider>
)
