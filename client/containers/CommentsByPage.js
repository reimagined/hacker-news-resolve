import React from 'react'
import { connect } from 'react-redux'

import Comment from '../components/Comment'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants'
import Paginator from '../components/Paginator'
import subscribe from '../decorators/subscribe'
import comments from '../../common/read-models/comments'

export const findRoot = (id, comments) => {
  const comment = comments.find(comment => id === comment.id)

  if (!comment) {
    return id
  }

  return findRoot(comment.parentId, comments)
}

export const CommentsByPage = props => {
  const { comments, match } = props
  const { page } = match.params

  const hasNext = !!comments[NUMBER_OF_ITEMS_PER_PAGE]

  return (
    <div>
      {comments.slice(0, NUMBER_OF_ITEMS_PER_PAGE).map(comment => {
        const parentId = comment.parentId
        const rootId = findRoot(parentId, comments)

        const parent =
          parentId === rootId
            ? `/storyDetails/${parentId}`
            : `/comment/${parentId}`

        return (
          <Comment
            key={comment.id}
            id={comment.id}
            content={comment.text}
            user={{
              id: comment.createdBy,
              name: comment.createdByName
            }}
            date={new Date(+comment.createdAt)}
            parent={parent}
          />
        )
      })}
      <Paginator page={page} hasNext={hasNext} location="/comments" />
    </div>
  )
}

export const mapStateToProps = ({ stories, users, comments }) => ({
  stories,
  users,
  comments
})

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($page: Int!) { comments(page: $page) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        page: match.params.page || '1'
      }
    }
  ]
}))(connect(mapStateToProps)(CommentsByPage))
