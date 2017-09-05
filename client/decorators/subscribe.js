import React from "react";
import PropTypes from "prop-types";
import { actions } from "resolve-redux";
import shallowEqual from "react-pure-render/shallowEqual";

function queryParams(params) {
  return Object.keys(params)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
    .join("&");
}

export default subscribe => Component => {
  class ResolveWrapper extends React.PureComponent {
    async refresh({ match }) {
      const { graphQL, events } = subscribe({ match });

      if (events) {
        this.context.store.dispatch(
          actions.setSubscription(events.eventTypes, events.aggregateIds)
        );
      }

      graphQL.forEach(async ({ readModel, query, variables }) => {
        const response = await fetch(
          `/api/queries/${readModel}?${queryParams({
            graphql: query,
            variables: JSON.stringify(variables)
          })}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin"
          }
        );

        if (response.ok) {
          // TODO
          //const data = await response.json();

          // this.context.store.dispatch(
          //   actions.replaceState(readModel, data[readModel])
          // );

          return;
        }

        const text = await response.text();

        // eslint-disable-next-line no-console
        return console.error("Error GraphQL query: ", text);
      });
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps.match.params, this.props.match.params)) {
        this.refresh(nextProps);
      }
    }

    componentDidMount() {
      this.refresh(this.props);
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  ResolveWrapper.subscribe = subscribe;
  ResolveWrapper.contextTypes = {
    store: PropTypes.object
  };
  return ResolveWrapper;
};
