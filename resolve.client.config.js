import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import RootComponent from './client/components/RootComponent';
import createStore from './client/store';

export default {
    rootComponent: () => <BrowserRouter><RootComponent /></BrowserRouter>,
    createStore
};
