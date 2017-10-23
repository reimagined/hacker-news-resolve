import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const isClient = typeof window === 'object'

const App = () =>
  isClient ? (
    <BrowserRouter>
      <RouteWithSubRoutes routes={routes} />
    </BrowserRouter>
  ) : (
    <StaticRouter>
      <RouteWithSubRoutes routes={routes} />
    </StaticRouter>
  )

export default App
