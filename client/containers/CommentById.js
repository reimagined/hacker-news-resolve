import React from 'react'
import { connect } from 'react-redux'

import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import comments from '../../common/read-models/comments'

export const CommentById = ({ comments, match }) => {
  const { id } = match.params
  const comment = comments.find(c => c.id === id)

  if (!comment) {
    return null
  }

  return (
    <Comment
      id={comment.id}
      content={comment.text}
      user={{
        id: comment.createdBy,
        name: comment.createdByName
      }}
      date={new Date(+comment.createdAt)}
      showReply
    >
      <ChildrenComments replies={comment.replies} comments={comments} />
    </Comment>
  )
}

export const mapStateToProps = ({ comments }) => ({
  comments
})

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($id: String!) { comments(id: $id) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps)(CommentById))
