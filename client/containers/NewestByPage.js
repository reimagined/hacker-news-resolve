import React from 'react'
import { connect } from 'react-redux'

import Stories from '../components/Stories'
import subscribe from '../decorators/subscribe'
import storyDetails from '../../common/read-models/storyDetails'

const NewestByPage = ({ match: { params: { page } }, storyDetails }) => (
  <Stories items={storyDetails} page={page || '1'} type="newest" />
)

export const mapStateToProps = ({ storyDetails }) => ({
  storyDetails
})

export default subscribe(({ match: { params: { page } } }) => ({
  graphQL: [
    {
      readModel: storyDetails,
      query:
        'query ($page: Int!) { storyDetails(page: $page) { id, type, title, text, createdAt, createdBy, createdByName, link, comments, commentsCount, votes } }',
      variables: {
        page: page || '1'
      }
    }
  ]
}))(connect(mapStateToProps)(NewestByPage))
