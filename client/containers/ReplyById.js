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
      storyId: this.props.stories[0].id,
      parentId: this.props.commentId,
      text: this.state.text,
      userId: this.props.userId
    })

    setTimeout(() => history.back(), 500)
  }

  onTextChange = event => this.setState({ text: event.target.value })

  render() {
    const { commentId, stories, loggedIn } = this.props

    if (!stories.length) {
      // TODO: fix me!!!
      return null
    }

    const story = stories[0]
    const comment = story.comments.find(({ id }) => id === commentId)
    if (!comment) {
      return null
    }

    return (
      <div>
        <div className="reply">
          <div className="reply__content">
            <Comment storyId={story.id} {...comment} />
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
  { match: { params: { commentId } } }
) => ({
  stories: storyDetails,
  commentId,
  userId: user.id,
  loggedIn: !!user.id
})

export default subscribe(({ match: { params: { storyId, commentId } } }) => ({
  graphQL: [
    {
      readModel: storyDetails,
      query: `query ($aggregateId: String, $commentId: String!) {
          storyDetails(aggregateId: $aggregateId, commentId: $commentId) {
            id,
            parentId,
            text,
            comments {
              id,
              parentId,
              text,
              createdAt,
              createdBy,
              createdByName
            },
            createdAt,
            createdBy,
            createdByName
          }
        }`,
      variables: {
        aggregateId: storyId,
        commentId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(ReplyById))
