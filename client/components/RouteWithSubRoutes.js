import React from 'react';
import { Route, Redirect, Switch } from 'react-router';

const RouteWithSubRoutes = ({
  path,
  component: Component,
  routes,
  exact,
  redirectTo
}) =>
  redirectTo ? (
    <Redirect from={path} to={redirectTo} />
  ) : routes ? (
    <Route
      path={path}
      exact={exact}
      render={props => {
        const content = (
          <Switch>
            {routes.map((route, index) => (
              <RouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        );

        return Component ? (
          <Component {...props}>{content}</Component>
        ) : (
          content
        );
      }}
    />
  ) : (
    <Route path={path} exact={exact} component={Component} />
  );

export default RouteWithSubRoutes;
