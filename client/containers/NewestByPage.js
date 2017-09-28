import React from 'react'
import { gql, graphql } from 'react-apollo'

import Stories from '../components/Stories'

const NewestByPage = ({
  match: { params: { page } },
  data: { stories = [] }
}) => <Stories items={stories} page={page || '1'} type="newest" />

export default graphql(
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
      // TODO: remove it after real reactivity will be implemented
      pollInterval: 1000,
      variables: {
        page: page || '1'
      }
    })
  }
)(NewestByPage)
