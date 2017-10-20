import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router'
import RouteWithSubRoutes from './RouteWithSubRoutes'
import routes from '../routes'

const isClient = typeof window === 'object'

const App = () => {
  const children = <RouteWithSubRoutes routes={routes} />

  return isClient ? (
    <BrowserRouter>{children}</BrowserRouter>
  ) : (
    <StaticRouter>{children}</StaticRouter>
  )
}

export default App
