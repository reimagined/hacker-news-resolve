import React from 'react'

import Stories from './Stories'
import subscribe from '../decorators/subscribe'
import stories from '../../common/read-models/stories'

const NewestByPage = ({ match }) => <Stories page={match.params.page || '1'} />

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: stories,
      query:
        'query ($page: Int!) { stories(page: $page) { id, type, title, text, createdAt, createdBy, link, comments, commentsCount, votes } }',
      variables: {
        page: match.params.page || '1'
      }
    }
  ]
}))(NewestByPage)
