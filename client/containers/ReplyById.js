import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import actions from '../actions/storiesActions'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import comments from '../../common/read-models/comments'
import '../styles/reply.css'

export class ReplyById extends React.PureComponent {
  state = {
    text: ''
  }

  saveReply = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.comment.id,
      userId: this.props.userId,
      storyId: this.props.storyId
    })
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => history.back(), 500)
  }

  onTextChange = event => this.setState({ text: event.target.value })

  render() {
    const { comment, loggedIn } = this.props

    if (!comment) {
      return null
    }

    return (
      <div>
        <div className="reply">
          <div className="reply__content">
            <Comment {...comment} />
            {loggedIn ? (
              <div>
                <textarea
                  name="text"
                  rows="6"
                  cols="70"
                  value={this.state.text}
                  onChange={this.onTextChange}
                />
                <div>
                  <button onClick={this.saveReply}>Reply</button>
                </div>
              </div>
            ) : null}
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

const mapStateToProps = (
  { comments, user },
  { match: { params: { commentId, storyId } } }
) => ({
  comment: comments.find(({ id }) => id === commentId),
  userId: user.id,
  loggedIn: !!user.id,
  storyId
})

export default subscribe(({ match: { params: { storyId, commentId } } }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($aggregateId: String, $commentId: String!) { comments(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        aggregateId: storyId,
        commentId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(ReplyById))
