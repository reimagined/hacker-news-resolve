import React from 'react'
import { graphql, gql } from 'react-apollo'
import { connect } from 'react-redux'

import Stories from '../components/Stories'

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

const withGraphql = graphql(
  gql`
    query($page: Int!) {
      stories(page: $page, type: "show") {
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
  {
    options: ({ match: { params: { page } } }) => ({
      variables: {
        page: page || '1'
      }
    })
  }
)

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

export default withGraphql(
  connect(mapStateToProps, mapDispatchToProps)(ShowByPage)
)
