import React from 'react'
import uuid from 'uuid'
import url from 'url'
import { Link } from 'react-router-dom'
import plur from 'plur'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import sanitizer from 'sanitizer'

import actions from '../actions/storiesActions'
import '../styles/story.css'

const isExternalLink = link => link[0] !== '/'

export const getHostname = link =>
  link.split('.')[0] === 'www' ? link.substr(4) : url.parse(link).hostname

export const voteArrow = (visible, upvoteStory) => {
  return visible ? (
    <span onClick={upvoteStory} className="story__votearrow" title="upvote" />
  ) : (
    <span className="story__votearrow--hidden" />
  )
}

export const getTitle = ({ title, link }) => {
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

export const PostedBy = ({ id, name }) => {
  return (
    <span>
      by{' '}
      <a className="story__meta-link story__by" href={`/user/${id}`}>
        {name}
      </a>{' '}
    </span>
  )
}

export const Discuss = ({ id, commentCount }) => {
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
    createdByName,
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
      {createdBy ? <PostedBy id={createdBy} name={createdByName} /> : null}
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
      <Discuss id={id} commentCount={commentCount} />
    </div>
  )
}

export class Story extends React.PureComponent {
  upvoteStory = () =>
    this.props.upvoteStory(this.props.story.id, this.props.userId)

  unvoteStory = () =>
    this.props.unvoteStory(this.props.story.id, this.props.userId)

  render() {
    const { story, loggedIn, showText, voted } = this.props

    if (!story) {
      return null
    }

    return (
      <div className="story">
        <div className="story__content">
          <Title
            loggedIn={loggedIn}
            voted={voted}
            upvoteStory={this.upvoteStory}
            title={
              story.type === 'ask' ? `Ask HN: ${story.title}` : story.title
            }
            link={story.link || `/storyDetails/${story.id}`}
          />
          <Meta
            voted={voted}
            id={story.id}
            createdBy={story.createdBy}
            createdByName={story.createdByName}
            createdAt={story.createdAt}
            votes={story.votes}
            commentCount={story.commentCount}
            unvoteStory={this.unvoteStory}
            loggedIn={loggedIn}
          />
          {showText && story.text ? (
            <div
              className="story__text"
              dangerouslySetInnerHTML={{
                __html: sanitizer.sanitize(story.text)
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export const mapStateToProps = ({ user, storyDetails, stories }, { id }) => {
  const search = story => story.id === id
  const story = storyDetails.find(search) || stories.find(search)

  return {
    story,
    voted: story && story.votes && story.votes.includes(user.id),
    loggedIn: !!user.id,
    userId: user.id
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
