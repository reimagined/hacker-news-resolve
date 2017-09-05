import React from "react";
import { StaticRouter } from "react-router";
import storageDriver from "resolve-storage-file";
import busDriver from "resolve-bus-memory";

import createStore from "./client/store";
import RouteWithSubRoutes from "./client/components/RouteWithSubRoutes";
import aggregates from "./common/aggregates";
import queries from "./common/read-models";
import events from "./common/events";
import { extendExpress, initialState } from "./server";
import routes from "./client/routes";

const eventTypes = Object.keys(events).map(key => events[key]);

export default {
  entries: {
    createStore,
    rootComponent: (props, context) => (
      <StaticRouter location={props.url} context={{}}>
        <RouteWithSubRoutes routes={routes} />
      </StaticRouter>
    )
  },
  bus: { driver: busDriver },
  storage: {
    driver: storageDriver,
    params: { pathToFile: "./storage.json" }
  },
  initialState: (...args) => initialState(queries, ...args),
  aggregates,
  initialSubscribedEvents: {
    types: eventTypes,
    ids: []
  },
  queries,
  extendExpress
};
