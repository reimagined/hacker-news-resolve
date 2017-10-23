import React from 'react'
import { Redirect } from 'react-router-dom'
import { gqlConnector } from 'resolve-redux'

import Comment from '../components/Comment'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants'
import Pagination from '../components/Pagination'

export const CommentsByPage = ({
  data: { comments = [] },
  match: { params: { page } }
}) =>
  page && !Number.isInteger(Number(page)) ? (
    <Redirect push to={`/error?text=No such page`} />
  ) : (
    <div>
      {comments
        .slice(0, NUMBER_OF_ITEMS_PER_PAGE)
        .map(comment => <Comment key={comment.id} {...comment} />)}
      <Pagination
        page={page}
        hasNext={!!comments[NUMBER_OF_ITEMS_PER_PAGE]}
        location="/comments"
      />
    </div>
  )

export default gqlConnector(
  `
    query($page: Int!) {
      comments(page: $page) {
        id
        parentId
        storyId
        text
        createdAt
        createdBy
        createdByName
      }
    }
  `,
  ({ match: { params: { page } } }) => ({
    page: page || '1'
  })
)(CommentsByPage)
