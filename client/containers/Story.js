import React from 'react'
import uuid from 'uuid'
import url from 'url'
import { Link } from 'react-router-dom'
import plur from 'plur'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import sanitizer from 'sanitizer'

import UserName from './UserName'
import actions from '../actions/stories'
import '../styles/story.css'

const isExternalLink = link => link[0] !== '/'

export const getHostname = link =>
  link.split('.')[0] === 'www' ? link.substr(4) : url.parse(link).hostname

const voteArrow = (visible, upvoteStory) => {
  return visible ? (
    <span onClick={upvoteStory} className="story__votearrow" title="upvote" />
  ) : (
    <span className="story__votearrow--hidden" />
  )
}

const getTitle = ({ title, link }) => {
  if (isExternalLink(link)) {
    return (
      <span>
        <span className="story__title">
          <a className="story__title-link" href={link}>
            {title}
          </a>
        </span>{' '}
        <span className="story__host">({getHostname(link)})</span>
      </span>
    )
  }
  return (
    <span className="story__title">
      <Link className="story__title-link" to={link}>
        {title}
      </Link>
    </span>
  )
}
export const Title = ({ title, link, upvoteStory, voted, loggedIn }) => {
  return (
    <div>
      {voteArrow(loggedIn && !voted, upvoteStory)}
      {getTitle({ title, link })}
    </div>
  )
}

export const Score = ({ score }) => {
  return (
    <span className="story__score">
      {score} {plur('point', score)}{' '}
    </span>
  )
}

export const PostedBy = ({ createdBy }) => {
  return (
    <span>
      by{' '}
      <a className="story__meta-link story__by" href={`/user/${createdBy}`}>
        <UserName userId={createdBy} />
      </a>{' '}
    </span>
  )
}

export const Comment = ({ id, commentCount }) => {
  return (
    <span>
      <span>
        |{' '}
        <Link className="story__meta-link" to={`/storyDetails/${id}`}>
          {commentCount > 0 ? (
            `${commentCount} ${plur('comment', commentCount)}`
          ) : (
            'discuss'
          )}
        </Link>{' '}
      </span>
    </span>
  )
}

export const Meta = props => {
  const {
    id,
    createdBy,
    createdAt,
    votes,
    commentCount,
    voted,
    loggedIn,
    unvoteStory
  } = props
  const unvoteIsVisible = voted && loggedIn

  return (
    <div className="story__meta">
      {votes ? <Score score={votes.length} /> : null}
      {createdBy ? <PostedBy createdBy={createdBy} /> : null}
      <span className="story__time">
        <TimeAgo date={new Date(+createdAt)} />{' '}
      </span>
      {unvoteIsVisible && (
        <span>
          |{' '}
          <span className="item__unvote" onClick={unvoteStory}>
            unvote
          </span>{' '}
        </span>
      )}
      {commentCount !== undefined ? (
        <Comment id={id} commentCount={commentCount} />
      ) : null}
    </div>
  )
}

class Story extends React.PureComponent {
  upvoteStory = () => this.props.upvoteStory(this.props.id, this.props.user.id)

  unvoteStory = () => this.props.unvoteStory(this.props.id, this.props.user.id)

  render() {
    const {
      id,
      type,
      title,
      link,
      text,
      createdBy,
      createdAt,
      votes,
      commentCount,
      voted,
      loggedIn,
      showText
    } = this.props

    if (!title) {
      return null
    }

    return (
      <div className="story">
        <div className="story__content">
          <Title
            loggedIn={loggedIn}
            voted={voted}
            upvoteStory={this.upvoteStory}
            title={type === 'ask' ? `Ask HN: ${title}` : title}
            link={link}
          />
          <Meta
            voted={voted}
            id={id}
            createdBy={createdBy}
            createdAt={createdAt}
            votes={votes}
            commentCount={commentCount}
            unvoteStory={this.unvoteStory}
            loggedIn={loggedIn}
          />
          {showText && text ? (
            <div
              className="story__text"
              dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(text) }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export const mapStateToProps = ({ user, stories }, { id }) => {
  const story = stories.find(story => story.id === id)

  if (!story) {
    return {}
  }

  return {
    id: story.id,
    title: story.title,
    text: story.text,
    link: story.link || `/storyDetails/${story.id}`,
    votes: story.votes,
    createdBy: story.createdBy,
    createdAt: story.createdAt,
    commentCount: story.commentsCount,
    voted: story.votes.includes(user.id),
    loggedIn: !!user.id,
    user
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Story)
