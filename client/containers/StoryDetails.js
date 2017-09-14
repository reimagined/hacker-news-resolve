import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'

import Story from '../containers/Story'
import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'
import subscribe from '../decorators/subscribe'
import storyDetails from '../../common/read-models/storyDetails'
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
          <ChildrenComments
            storyId={story.id}
            comments={comments}
            parentId={story.id}
          />
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (
  { storyDetails, comments, user },
  { match: { params: { storyId } } }
) => ({
  story: storyDetails[0],
  comments: storyDetails.slice(1),
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
      readModel: storyDetails,
      query:
        'query ($aggregateId: ID!) { storyDetails(aggregateId: $aggregateId) { id, type, title, text, createdAt, createdBy, createdByName, link, commentCount, votes, parentId } }',
      variables: {
        aggregateId: storyId
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
