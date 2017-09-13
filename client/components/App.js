import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'

import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

export const clientRootComponent = () => (
  <BrowserRouter>
    <RouteWithSubRoutes routes={routes} />
  </BrowserRouter>
)

export const serverRootComponent = props => (
  <StaticRouter location={props.url} context={{}}>
    <RouteWithSubRoutes routes={routes} />
  </StaticRouter>
)
