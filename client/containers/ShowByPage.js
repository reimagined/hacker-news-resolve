import React from 'react'
import { connect } from 'react-redux'
import { gqlConnector } from 'resolve-redux'

import Stories from '../components/Stories'
import { ITEMS_PER_PAGE } from '../constants'

class ShowByPage extends React.PureComponent {
  componentDidUpdate = () => {
    const { refetchStories, onRefetched, data: { refetch } } = this.props

    if (refetchStories.show) {
      refetch()
      onRefetched()
    }
  }

  render() {
    const {
      match: { params: { page } },
      data: { stories = [], refetch }
    } = this.props

    return <Stories refetch={refetch} items={stories} page={page} type="show" />
  }
}

const mapStateToProps = ({ ui: { refetchStories } }) => ({
  refetchStories
})

const mapDispatchToProps = dispatch => ({
  onRefetched: () =>
    dispatch({
      type: 'STORIES_REFETCHED',
      page: 'show'
    })
})

export default gqlConnector(
  `
    query($first: Int!, $offset: Int) {
      stories(type: "show", first: $first, offset: $offset) {
        id
        type
        title
        text
        link
        commentCount
        votes
        createdAt
        createdBy
        createdByName
      }
    }
  `,
  ({ match: { params: { page } } }) => ({
    first: ITEMS_PER_PAGE + 1,
    offset: (+page - 1) * ITEMS_PER_PAGE
  })
)(connect(mapStateToProps, mapDispatchToProps)(ShowByPage))
