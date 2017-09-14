import React from 'react'
import { connect } from 'react-redux'

import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'
import ReplyLink from '../components/ReplyLink'
import subscribe from '../decorators/subscribe'
import storyDetails from '../../common/read-models/storyDetails'

export const CommentById = ({ storyId, comments, comment }) => {
  if (!comment) {
    return null
  }

  return (
    <Comment storyId={storyId} level={0} {...comment}>
      <ReplyLink storyId={storyId} commentId={comment.id} level={0} />
      <ChildrenComments
        storyId={storyId}
        comments={comments}
        parentId={comment.id}
      />
    </Comment>
  )
}

export const mapStateToProps = (
  { storyDetails },
  { match: { params: { storyId, commentId } } }
) => ({
  storyId: storyId,
  comments: storyDetails,
  comment: storyDetails.find(({ id }) => id === commentId)
})

export default subscribe(({ match: { params: { storyId, commentId } } }) => ({
  graphQL: [
    {
      readModel: storyDetails,
      query:
        'query ($aggregateId: String!, $commentId: String!) { storyDetails(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, createdAt, createdBy, createdByName } }',
      variables: {
        aggregateId: storyId,
        commentId: commentId
      }
    }
  ]
}))(connect(mapStateToProps)(CommentById))
