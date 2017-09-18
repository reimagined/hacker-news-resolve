import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import actions from '../actions/storiesActions'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import storyDetails from '../../common/read-models/storyDetails'
import '../styles/reply.css'

export class ReplyById extends React.PureComponent {
  state = {
    text: ''
  }

  saveComment = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.comment.id,
      userId: this.props.userId,
      storyId: this.props.storyId
    })

    setTimeout(() => history.back(), 500)
  }

  onTextChange = event => this.setState({ text: event.target.value })

  render() {
    const { storyId, comment, loggedIn } = this.props

    if (!comment) {
      return null
    }

    return (
      <div>
        <div className="reply">
          <div className="reply__content">
            <Comment storyId={storyId} {...comment} />
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
                  <button onClick={this.saveComment}>Reply</button>
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
      createComment: ({ storyId, parentId, userId, text }) =>
        actions.createComment(storyId, {
          commentId: uuid.v4(),
          parentId,
          userId,
          text
        })
    },
    dispatch
  )

const mapStateToProps = (
  { storyDetails, user },
  { match: { params: { commentId, storyId } } }
) => ({
  storyId,
  comment: storyDetails.find(({ id }) => id === commentId),
  userId: user.id,
  loggedIn: !!user.id
})

export default subscribe(({ match: { params: { storyId, commentId } } }) => ({
  graphQL: [
    {
      readModel: storyDetails,
      query:
        'query ($aggregateId: String, $commentId: String!) { storyDetails(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, createdAt, createdBy, createdByName } }',
      variables: {
        aggregateId: storyId,
        commentId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(ReplyById))
