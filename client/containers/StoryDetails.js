import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import Story from '../containers/Story'
import actions from '../actions/stories'
import Comment from '../components/Comment'
import ChildrenComments from '../components/ChildrenComments'
import subscribe from '../decorators/subscribe'
import stories from '../../common/read-models/stories'
import comments from '../../common/read-models/comments'
import '../styles/storyDetails.css'

export class StoryDetails extends React.PureComponent {
  state = {
    text: ''
  }

  onAddComment = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.storyId,
      userId: this.props.user.id
    })
    this.setState({ text: '' })
  }

  onChangeText = event =>
    this.setState({
      text: event.target.value
    })

  render() {
    const { storyId, comments } = this.props

    return (
      <div className="storyDetails">
        <Story id={storyId} showText />
        <div className="storyDetails__content">
          <div className="storyDetails__textarea">
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={this.onChangeText}
            />
          </div>
          <div>
            <button onClick={this.onAddComment}>add comment</button>
          </div>
        </div>
        <div>
          {comments.map(comment => (
            <Comment key={comment.id} {...comment} showReply>
              <ChildrenComments replies={comment.replies} comments={comments} />
            </Comment>
          ))}
        </div>
      </div>
    )
  }
}

export const mapStateToProps = ({ stories, comments, user }, { match }) => ({
  stories,
  comments,
  user,
  storyId: match.params.storyId
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createComment: ({ parentId, text, userId }) =>
        actions.createComment(parentId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        })
    },
    dispatch
  )

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: stories,
      query:
        'query ($aggregateId: ID!) { stories(aggregateId: $aggregateId) { id, type, title, text, userId, userName, createDate, link, comments, commentsCount, voted } }',
      variables: {
        aggregateId: match.params.storyId
      }
    },
    {
      readModel: comments,
      query:
        'query ($aggregateId: ID!) { comments(aggregateId: $aggregateId) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        aggregateId: match.params.storyId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
