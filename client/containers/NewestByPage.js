import React from 'react'
import { connect } from 'react-redux'

import Stories from '../components/Stories'
import subscribe from '../decorators/subscribe'
import stories from '../../common/read-models/stories'

const NewestByPage = ({ match: { params: { page } }, stories }) => (
  <Stories items={stories} page={page || '1'} type="newest" />
)

export const mapStateToProps = ({ stories }) => ({
  stories
})

export default subscribe(({ match: { params: { page } } }) => ({
  graphQL: [
    {
      readModel: stories,
      query:
        'query ($page: Int!) { stories(page: $page) { id, type, title, text, createdAt, createdBy, createdByName, link, commentCount, votes } }',
      variables: {
        page: page || '1'
      }
    }
  ]
}))(connect(mapStateToProps)(NewestByPage))
