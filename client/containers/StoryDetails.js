import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import { graphql, gql } from 'react-apollo'

import Story from '../containers/Story'
import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'
import '../styles/storyDetails.css'

export class StoryDetails extends React.PureComponent {
  state = {
    text: ''
  }

  saveComment = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.data.story.id,
      userId: this.props.userId
    })
    this.setState({ text: '' })
  }

  onChangeText = event =>
    this.setState({
      text: event.target.value
    })

  render() {
    const { data: { story }, loggedIn } = this.props

    if (!story) {
      return null
    }

    return (
      <div className="storyDetails">
        <Story story={story} />
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
              <button onClick={this.saveComment}>add comment</button>
            </div>
          </div>
        ) : null}
        <div>
          <ChildrenComments
            storyId={story.id}
            comments={story.comments}
            parentId={story.id}
          />
        </div>
      </div>
    )
  }
}

export const mapStateToProps = ({ storyDetails, user }) => ({
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

export default graphql(
  gql`
    query($aggregateId: ID!) {
      story(aggregateId: $aggregateId) {
        id
        type
        title
        text
        link
        comments {
          id
          parentId
          text
          createdAt
          createdBy
          createdByName
        }
        votes
        createdAt
        createdBy
        createdByName
      }
    }
  `,
  {
    options: ({ match: { params: { storyId } } }) => ({
      // TODO: remove it after real reactivity will be implemented
      pollInterval: 1000,
      variables: {
        aggregateId: storyId
      }
    })
  }
)(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
