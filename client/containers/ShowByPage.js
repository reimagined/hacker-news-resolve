import React from 'react'
import { connect } from 'react-redux'
import { gqlConnector } from 'resolve-redux'

import Stories from '../components/Stories'
import { ITEMS_PER_PAGE } from '../constants'

const ShowByPage = ({
  match: { params: { page } },
  data: { stories = [], me = {}, refetch },
  lastVotedStory
}) => (
  <Stories
    refetch={refetch}
    items={stories}
    page={page}
    type="show"
    userId={me.id}
    lastVotedStory={lastVotedStory}
  />
)

const mapStateToProps = ({ ui: { lastVotedStory } }) => ({
  lastVotedStory
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
      me {
        id
      }
    }
  `,
  {
    options: ({ match: { params: { page } } }) => ({
      variables: {
        first: ITEMS_PER_PAGE + 1,
        offset: (+page - 1) * ITEMS_PER_PAGE
      },
      fetchPolicy: 'network-only'
    })
  }
)(connect(mapStateToProps)(ShowByPage))
