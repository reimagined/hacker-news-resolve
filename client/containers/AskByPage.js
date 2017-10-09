import React from 'react'
import { graphql, gql } from 'react-apollo'

import Stories from '../components/Stories'

const AskByPage = ({ match: { params: { page } }, data: { stories = [] } }) => (
  <Stories items={stories} page={page} type="ask" />
)

export default graphql(
  gql`
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
  {
    options: ({ match: { params: { page } } }) => ({
      variables: {
        page: page || '1'
      }
    })
  }
)(AskByPage)
