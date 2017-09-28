import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import { ApolloClient, ApolloProvider } from 'react-apollo'

import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const client = new ApolloClient()

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
