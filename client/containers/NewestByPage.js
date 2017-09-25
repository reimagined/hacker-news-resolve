import React from 'react'
import { gql, graphql } from 'react-apollo'

import Stories from '../components/Stories'

const NewestByPage = ({
  match: { params: { page } },
  data: { stories = [] }
}) => <Stories items={stories} page={page || '1'} type="newest" />

export const mapStateToProps = ({ stories }) => ({
  stories
})

export default graphql(
  gql`
    query($page: Int!) {
      stories(page: $page) {
        id
        type
        title
        link
        text
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
      pollInterval: 5000,
      variables: {
        page: page || '1'
      }
    })
  }
)(NewestByPage)
