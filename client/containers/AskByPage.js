import React from 'react'
import { connect } from 'react-redux'
import { gqlConnector } from 'resolve-redux'

import Stories from '../components/Stories'

class AskByPage extends React.PureComponent {
  componentDidUpdate = () => {
    const { refetchStories, onRefetched, data: { refetch } } = this.props

    if (refetchStories.ask) {
      refetch()
      onRefetched()
    }
  }

  render() {
    const {
      match: { params: { page } },
      data: { stories = [], refetch }
    } = this.props

    return <Stories refetch={refetch} items={stories} page={page} type="ask" />
  }
}

const mapStateToProps = ({ ui: { refetchStories } }) => ({
  refetchStories
})

const mapDispatchToProps = dispatch => ({
  onRefetched: () =>
    dispatch({
      type: 'STORIES_REFETCHED',
      page: 'ask'
    })
})

export default gqlConnector(
  `
    query($page: Int!) {
      stories(page: $page, type: "ask") {
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
    page: page || '1'
  })
)(connect(mapStateToProps, mapDispatchToProps)(AskByPage))
