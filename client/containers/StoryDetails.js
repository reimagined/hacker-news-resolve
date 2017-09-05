import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuid from 'uuid'
import sanitizer from 'sanitizer'

import Story from '../components/Story'
import actions from '../actions/stories'
import storyActions from '../actions/stories'
import Comment from '../components/Comment'
import ChildrenComments from '../components/ChildrenComments'
import subscribe from '../decorators/subscribe'
import '../styles/storyDetails.css'

export class StoryDetails extends Component {
  state = {
    text: ''
  }

  onAddComment(parentId, userId) {
    this.props.onAddComment({
      text: this.state.text,
      parentId,
      userId
    })
    this.setState({ text: '' })
  }

  render() {
    const { id, stories, users } = this.props
    const story = stories.find(story => story.id === id)
    const user = users.find(({ id }) => id === story.userId)
    const link = story.type === 'ask' ? `/storyDetails/${id}` : story.link

    return (
      <div className="storyDetails">
        <Story
          id={id}
          title={story.title}
          link={link}
          score={story.voted.length}
          voted={story.voted.includes(this.props.user.id)}
          user={user}
          date={new Date(story.createDate)}
          commentCount={story.commentsCount}
          onUpvote={() => this.props.onUpvote(id, this.props.user.id)}
          onUnvote={() => this.props.onUnvote(id, this.props.user.id)}
          loggedIn={!!this.props.user.id}
        />
        {story.text && (
          <div
            className="storyDetails__text"
            dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(story.text) }}
          />
        )}
        <div className="storyDetails__content">
          <div className="storyDetails__textarea">
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
            />
          </div>
          <div>
            <button onClick={() => this.onAddComment(id, this.props.user.id)}>
              add comment
            </button>
          </div>
        </div>
        <div>
          {story.comments.map(commentId => {
            const comment = this.props.comments.find(
              ({ id }) => id === commentId
            )

            const user = this.props.users.find(u => u.id === comment.createdBy)

            return (
              <Comment
                key={commentId}
                id={comment.id}
                content={comment.text}
                user={user.name}
                date={new Date(comment.createdAt)}
                showReply
              >
                <ChildrenComments
                  replies={comment.replies}
                  comments={this.props.comments}
                  users={this.props.users}
                />
              </Comment>
            )
          })}
        </div>
      </div>
    )
  }
}

export const mapStateToProps = (state, { match }) => {
  return {
    stories: state.stories,
    users: state.users,
    comments: state.comments,
    user: state.user,
    id: match.params.id
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    onAddComment({ parentId, text, userId }) {
      return dispatch(
        actions.createComment(parentId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        })
      )
    },
    onUpvote(id, userId) {
      return dispatch(
        storyActions.upvoteStory(id, {
          userId
        })
      )
    },
    onUnvote(id, userId) {
      return dispatch(
        storyActions.unvoteStory(id, {
          userId
        })
      )
    }
  }
}

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: 'stories',
      query:
        'query ($id: ID!) { stories(id: $id) { id, type, title, text, userId, createDate, link, comments, commentsCount, voted } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
