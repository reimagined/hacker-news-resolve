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
      variables: {
        page: page || '1'
      }
    })
  }
)(ShowByPage)
