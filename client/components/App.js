import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const isClient = typeof window === 'object'

const App = () =>
  isClient ? (
    <BrowserRouter basename={process.env.ROOT_DIR}>
      <RouteWithSubRoutes routes={routes} />
    </BrowserRouter>
  ) : (
    <StaticRouter basename={process.env.ROOT_DIR} context={{}}>
      <RouteWithSubRoutes routes={routes} />
    </StaticRouter>
  )

export default App
