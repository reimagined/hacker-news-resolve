import React from 'react';
import { StaticRouter } from 'react-router';
import storageDriver from 'resolve-storage-file';
import busDriver from 'resolve-bus-memory';
import jwt from 'jsonwebtoken';

import createStore from './client/store';
import RootComponent from './client/containers/RootComponent';
import aggregates from './common/aggregates';
import queries from './common/read-models';
import events from './common/events';
import extendExpress from './server/extendExpress';
import authorizationSecret from './server/authorizationSecret';

async function getInitialState(executeQuery, { cookies }) {
  let user;
  try {
    user = (await executeQuery('users'))[
      jwt.verify(cookies.authorizationToken, authorizationSecret).id
    ];
  } catch (error) {
    user = {};
  }

  const resultOfQueries = await Promise.all(
    queries.map(async ({ name }) => {
      const state = await executeQuery(name);
      return { state, name };
    })
  );

  return resultOfQueries.reduce(
    (result, { state, name }) => {
      result[name] = state;
      return result;
    },
    { user }
  );
}

const dbPath = './storage.json';

export default {
  entries: {
    createStore,
    rootComponent: (props, context) =>
      <StaticRouter location={props.url} context={{}}>
        <RootComponent />
      </StaticRouter>
  },
  bus: { driver: busDriver },
  storage: {
    driver: storageDriver,
    params: { pathToFile: dbPath }
  },
  initialState: getInitialState,
  aggregates,
  events,
  queries,
  extendExpress
};
