import React from 'react'
import { connect } from 'react-redux'

import Stories from '../components/Stories'
import subscribe from '../decorators/subscribe'
import stories from '../../common/read-models/stories'

const AskByPage = ({ match: { params: { page } }, stories }) => (
  <Stories items={stories} page={page} type="ask" />
)

export const mapStateToProps = ({ stories }) => ({
  stories
})

export default subscribe(({ match: { params: { page } } }) => ({
  graphQL: [
    {
      readModel: stories,
      query: `query ($page: Int!) {
          stories(page: $page, type: "ask") {
            id,
            type,
            title,
            text,
            link,
            commentCount,
            votes,
            createdAt,
            createdBy,
            createdByName
          } 
        }`,
      variables: {
        page: page || '1'
      }
    }
  ]
}))(connect(mapStateToProps)(AskByPage))
