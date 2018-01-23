import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'

import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'
import { rootDirectory } from '../constants'

const isClient = typeof window === 'object'

const App = () =>
  isClient ? (
    <BrowserRouter basename={rootDirectory}>
      <RouteWithSubRoutes routes={routes} />
    </BrowserRouter>
  ) : (
    <StaticRouter basename={rootDirectory} context={{}}>
      <RouteWithSubRoutes routes={routes} />
    </StaticRouter>
  )

export default App
