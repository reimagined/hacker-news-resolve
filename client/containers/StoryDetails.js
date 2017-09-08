import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import Story from '../containers/Story'
import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'
import subscribe from '../decorators/subscribe'
import stories from '../../common/read-models/stories'
import comments from '../../common/read-models/comments'
import '../styles/storyDetails.css'

export class StoryDetails extends React.PureComponent {
  state = {
    text: ''
  }

  saveReply = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.story.id,
      userId: this.props.userId
    })
    this.setState({ text: '' })
  }

  onChangeText = event =>
    this.setState({
      text: event.target.value
    })

  render() {
    const { story, comments, loggedIn } = this.props

    if (!story) {
      return null
    }

    return (
      <div className="storyDetails">
        <Story id={story.id} showText />
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
              <button onClick={this.saveReply}>add comment</button>
            </div>
          </div>
        ) : null}
        <div>
          <ChildrenComments replies={story.comments} comments={comments} />
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (
  { stories, comments, user },
  { match: { params: { storyId } } }
) => ({
  story: stories.find(story => story.id === storyId),
  comments,
  userId: user.id,
  loggedIn: !!user.id
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

export default subscribe(({ match: { params: { storyId } } }) => ({
  graphQL: [
    {
      readModel: stories,
      query:
        'query ($aggregateId: ID!) { stories(aggregateId: $aggregateId) { id, type, title, text, createdAt, createdBy, link, comments, commentsCount, votes } }',
      variables: {
        aggregateId: storyId
      }
    },
    {
      readModel: comments,
      query:
        'query ($aggregateId: ID!) { comments(aggregateId: $aggregateId) {  text, id, parentId, storyId, createdAt, createdBy, replies } }',
      variables: {
        aggregateId: storyId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
