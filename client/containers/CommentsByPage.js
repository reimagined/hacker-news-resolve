import React from 'react'
import { connect } from 'react-redux'

import Comment from '../components/Comment'
import { getPageStories, hasNextStories } from '../helpers/getPageStories'
import Paginator from '../components/Paginator'
import subscribe from '../decorators/subscribe'

export const findRoot = (id, comments) => {
  const comment = comments.find(comment => id === comment.id)

  if (!comment) {
    return id
  }

  return findRoot(comment.parentId, comments)
}

export const Comments = props => {
  const { comments, match } = props
  const { page } = match.params

  const hasNext = hasNextStories(comments, page)

  return (
    <div>
      {getPageStories(comments, page).map(comment => {
        const parentId = comment.parentId
        const rootId = findRoot(parentId, comments)

        const parent =
          parentId === rootId
            ? `/storyDetails/${parentId}`
            : `/comment/${parentId}`

        const root = props.stories.find(({ id }) => id === rootId)
        const user = props.users.find(({ id }) => id === comment.createdBy)

        return (
          <Comment
            key={comment.id}
            replies={comment.replies}
            id={comment.id}
            content={comment.text}
            user={user}
            date={new Date(comment.createdAt)}
            parent={parent}
            root={root}
          />
        )
      })}
      <Paginator page={page} hasNext={hasNext} location="/comments" />
    </div>
  )
}

export const mapStateToProps = ({ stories, users, comments }) => {
  return {
    stories,
    users,
    comments
  }
}

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: 'comments',
      query:
        'query ($page: Int!) { comments(page: $page) { text, id, parentId, createdAt, createdBy, replies } }',
      variables: {
        page: match.params.page || '1'
      }
    }
  ]
}))(connect(mapStateToProps)(Comments))
