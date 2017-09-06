import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import actions from '../actions/stories'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import comments from '../../common/read-models/comments'
import '../styles/reply.css'

export class ReplyById extends Component {
  state = {
    text: ''
  }

  onReply(parentId, userId, storyId) {
    this.props.createComment({
      text: this.state.text,
      parentId,
      userId,
      storyId
    })
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => history.back(), 500)
  }

  render() {
    const { comments, user, commentId } = this.props
    const comment = comments.find(({ id }) => id === commentId)

    if (!comment) {
      return null
    }

    return (
      <div>
        <div className="reply">
          <div className="reply__content">
            <Comment
              showReply={false}
              id={comment.id}
              storyId={comment.storyId}
              content={comment.text}
              user={{
                id: comment.createdBy,
                name: comment.createdByName
              }}
              date={new Date(+comment.createdAt)}
            />
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
            />
            <div>
              <button
                onClick={() => this.onReply(id, user.id, comment.storyId)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createComment: ({ parentId, text, userId, storyId }) =>
        actions.createComment(storyId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        })
    },
    dispatch
  )

const mapStateToProps = ({ comments, user }, { match }) => ({
  comments,
  user,
  commentId: match.params.commentId
})

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($aggregateId: String, $commentId: String!) { comments(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        aggregateId: match.params.storyId,
        commentId: match.params.commentId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(ReplyById))
