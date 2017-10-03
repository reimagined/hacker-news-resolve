import React from 'react'
import { gql, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Stories from '../components/Stories'

const NewestByPage = ({
  refetchStories,
  match: { params: { page } },
  data: { stories = [], refetch },
  onRefetched
}) => {
  if (refetchStories) {
    onRefetched()
    refetch()
  }

  return <Stories items={stories} page={page || '1'} type="newest" />
}

const withGraphql = graphql(
  gql`
    query($page: Int!) {
      stories(page: $page) {
        id
        type
        title
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
      type: 'STORIES_REFETCHED'
    })
})

export default withGraphql(
  connect(mapStateToProps, mapDispatchToProps)(NewestByPage)
)
