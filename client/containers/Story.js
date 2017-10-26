import React from 'react'
import uuid from 'uuid'
import url from 'url'
import { Link } from 'react-router-dom'
import plur from 'plur'
import TimeAgo from 'react-timeago'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import sanitizer from 'sanitizer'
import styled, { css } from 'styled-components'

import Splitter from '../components/Splitter'
import actions from '../actions/storiesActions'

export const Text = styled.div`
  color: #000;
  font-size: 14px;
  padding-left: 1.25em;
  padding-top: 1.25em;
`

export const Header = styled.div`
  display: inline-block;
  color: #000;
  font-size: 14px;
`

export const MetaWrapper = styled.div`
  color: #666;
  font-size: 8pt;
  padding-left: 1.25em;
`

export const Href = styled.div`
  display: inline-block;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const Upvote = styled.div`
  display: inline-block;
  cursor: pointer;
  width: 0px;
  height: 0px;
  border: 0px;
  border-width: 5px;
  border-bottom-width: 8px;
  border-style: solid;
  border-color: transparent;
  border-bottom-color: gray;
  margin-right: 4px;

  ${props =>
    props.hidden &&
    css`
      cursor: auto;
      background: none;
      border-bottom-color: transparent;
    `};
`

const Username = styled.a`
  display: inline-block;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const isExternalLink = link => link[0] !== '/'

export const getHostname = link => {
  return url.parse(link).hostname
}

export const voteArrow = (visible, upvoteStory) => {
  return visible ? (
    <Upvote onClick={upvoteStory} title="upvote" />
  ) : (
    <Upvote hidden />
  )
}

export const getTitle = ({ title, link }) => {
  if (isExternalLink(link)) {
    return (
      <span>
        <Header>
          <a href={link}>{title}</a>
        </Header>{' '}
        ({getHostname(link)})
      </span>
    )
  }
  return (
    <Header>
      <Link to={link}>{title}</Link>
    </Header>
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
    <span>
      {score} {plur('point', score)}{' '}
    </span>
  )
}

export const PostedBy = ({ id, name }) => {
  return (
    <span>
      by <Username href={`/user/${id}`}>{name}</Username>{' '}
    </span>
  )
}

export const Discuss = ({ id, commentCount }) => {
  return (
    <span>
      <Splitter />
      <Link to={`/storyDetails/${id}`}>
        <Href>
          {commentCount > 0 ? (
            `${commentCount} ${plur('comment', commentCount)}`
          ) : (
            'discuss'
          )}
        </Href>
      </Link>{' '}
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
    <MetaWrapper>
      {votes ? <Score score={votes.length} /> : null}
      {createdBy ? <PostedBy id={createdBy} name={createdByName} /> : null}
      <TimeAgo date={new Date(+createdAt)} />
      {unvoteIsVisible && (
        <span>
          <Splitter />
          <Href onClick={unvoteStory}>unvote</Href>{' '}
        </span>
      )}
      <Discuss id={id} commentCount={commentCount} />
    </MetaWrapper>
  )
}

export class Story extends React.PureComponent {
  componentDidUpdate = () => {
    const { refetchStory, onRefetched, refetch } = this.props

    if (refetch && refetchStory) {
      refetch()
      onRefetched()
    }
  }

  upvoteStory = () =>
    this.props.upvoteStory(this.props.story.id, this.props.userId)

  unvoteStory = () =>
    this.props.unvoteStory(this.props.story.id, this.props.userId)

  render() {
    const { story, loggedIn, voted, showText } = this.props

    if (!story) {
      return null
    }

    let commentCount = story.comments
      ? story.comments.length
      : story.commentCount
    return (
      <div>
        <Title
          loggedIn={loggedIn}
          voted={voted}
          upvoteStory={this.upvoteStory}
          title={story.type === 'ask' ? `Ask HN: ${story.title}` : story.title}
          link={story.link || `/storyDetails/${story.id}`}
        />
        <Meta
          voted={voted}
          id={story.id}
          votes={story.votes}
          commentCount={commentCount}
          unvoteStory={this.unvoteStory}
          loggedIn={loggedIn}
          createdAt={story.createdAt}
          createdBy={story.createdBy}
          createdByName={story.createdByName}
        />
        {story.text && showText ? (
          <Text
            dangerouslySetInnerHTML={{
              __html: sanitizer.sanitize(story.text)
            }}
          />
        ) : null}
      </div>
    )
  }
}

export const mapStateToProps = ({ user, ui: { refetchStory } }, { story }) => {
  return {
    story,
    voted: story && story.votes && story.votes.includes(user.id),
    loggedIn: !!user.id,
    userId: user.id,
    refetchStory
  }
}

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      commentStory: ({ parentId, text, userId }) =>
        actions.commentStory(parentId, {
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
        }),
      onRefetched: () => ({
        type: 'STORY_REFETCHED'
      })
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Story)
