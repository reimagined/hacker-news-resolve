import React from 'react'
import PropTypes from 'prop-types'
import { actions } from 'resolve-redux'
import shallowEqual from 'react-pure-render/shallowEqual'
import Immutable from 'seamless-immutable'

function queryParams(params) {
  return Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&')
}

export const executeQuery = async ({ readModel, query, variables }) => {
  const response = await fetch(
    `/api/query/?${queryParams({
      graphql: query,
      variables: JSON.stringify(variables)
    })}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    }
  )

  if (response.status === 200) {
    return await response.json()
  }
  throw response
}

export default subscribe => Component => {
  class ResolveWrapper extends React.PureComponent {
    async refresh({ match }) {
      const store = this.context.store

      const { graphQL, events } = subscribe({ match })

      if (events) {
        this.context.store.dispatch(
          actions.setSubscription(events.eventTypes, events.aggregateIds)
        )
      }

      graphQL.forEach(async ({ readModel, query, variables }) => {
        const prevState = this.context.store.getState()[readModel.name]
        store.dispatch(
          actions.replaceState(readModel.name, readModel.initialState)
        )

        try {
          const data = await executeQuery({ readModel, query, variables })

          return store.dispatch(
            actions.replaceState(
              readModel.name,
              Immutable(data[readModel.name])
            )
          )
        } catch (error) {
          store.dispatch(actions.replaceState(readModel.name, prevState))
          console.log(error)
        }
      })
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps.match.params, this.props.match.params)) {
        this.refresh(nextProps)
      }
    }

    componentDidMount() {
      this.refresh(this.props)
    }

    render() {
      return <Component {...this.props} />
    }
  }
  ResolveWrapper.subscribe = subscribe
  ResolveWrapper.contextTypes = {
    store: PropTypes.object
  }
  return ResolveWrapper
}
