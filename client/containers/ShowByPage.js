import React from 'react'
import { graphql, gql } from 'react-apollo'

import Stories from '../components/Stories'

export const ShowByPage = ({
  match: { params: { page } },
  data: { stories = [] }
}) => <Stories items={stories} page={page} type="show" />

export default graphql(
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
      // TODO: remove it after real reactivity will be implemented
      pollInterval: 1000,
      variables: {
        page: page || '1'
      }
    })
  }
)(ShowByPage)
