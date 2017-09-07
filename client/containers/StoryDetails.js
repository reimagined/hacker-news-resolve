import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import Story from '../containers/Story'
import actions from '../actions/stories'
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
    const { storyId, comments, stories, loggedIn } = this.props

    const story = stories.find(story => story.id === storyId)

    return (
      <div className="storyDetails">
        <Story id={storyId} showText />
        {loggedIn ? (
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
        ) : null}
        {story ? (
          <div>
            <ChildrenComments replies={story.comments} comments={comments} />
          </div>
        ) : null}
      </div>
    )
  }
}

export const mapStateToProps = ({ stories, comments, user }, { match }) => ({
  stories,
  comments,
  user,
  loggedIn: !!user.id,
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
        'query ($aggregateId: ID!) { stories(aggregateId: $aggregateId) { id, type, title, text, createdAt, createdBy, link, comments, commentsCount, votes } }',
      variables: {
        aggregateId: match.params.storyId
      }
    },
    {
      readModel: comments,
      query:
        'query ($aggregateId: ID!) { comments(aggregateId: $aggregateId) {  text, id, parentId, storyId, createdAt, createdBy, replies } }',
      variables: {
        aggregateId: match.params.storyId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
