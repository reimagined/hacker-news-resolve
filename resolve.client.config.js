import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import RouteWithSubRoutes from './client/components/RouteWithSubRoutes'
import createStore from './client/store'
import routes from './client/routes'

export default {
  createStore,
  rootComponent: () => (
    <BrowserRouter>
      <RouteWithSubRoutes routes={routes} />
    </BrowserRouter>
  )
}
