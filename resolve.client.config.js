import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import RootComponent from './client/containers/RootComponent';
import createStore from './client/store';

export default {
  createStore,
  rootComponent: () => (
    <BrowserRouter>
      <RootComponent />
    </BrowserRouter>
  )
};
