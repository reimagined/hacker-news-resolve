import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import sanitizer from 'sanitizer'

import Story from '../components/Story'
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

  onUpvote = () =>
    this.props.upvoteStory(this.props.storyId, this.props.user.id)

  onUnvote = () =>
    this.props.unvoteStory(this.props.storyId, this.props.user.id)

  render() {
    const { storyId, stories, comments, user } = this.props
    const story = stories.find(({ id }) => id === storyId)

    if (!story) {
      return null
    }

    const link = story.type === 'ask' ? `/storyDetails/${storyId}` : story.link

    return (
      <div className="storyDetails">
        <Story
          id={story.id}
          title={story.title}
          link={link}
          score={story.voted.length}
          voted={story.voted.includes(user.id)}
          user={{
            id: story.userId,
            name: story.userName
          }}
          date={new Date(+story.createDate)}
          commentCount={story.commentsCount}
          onUpvote={this.onUpvote}
          onUnvote={this.onUnvote}
          loggedIn={!!user.id}
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
              onChange={this.onChangeText}
            />
          </div>
          <div>
            <button onClick={this.onAddComment}>add comment</button>
          </div>
        </div>
        <div>
          {story.comments.map(commentId => {
            const comment = comments.find(({ id }) => id === commentId)

            if (!comment) {
              return null
            }

            return (
              <Comment
                key={comment.id}
                id={comment.id}
                storyId={comment.storyId}
                content={comment.text}
                user={{
                  id: comment.createdBy,
                  name: comment.createdByName
                }}
                date={new Date(+comment.createdAt)}
                showReply
              >
                <ChildrenComments
                  replies={comment.replies}
                  comments={comments}
                />
              </Comment>
            )
          })}
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
        }),
      upvoteStory: (id, userId) =>
        actions.upvoteStory(id, {
          userId
        }),
      unvoteStory: (id, userId) =>
        actions.unvoteStory(id, {
          userId
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
