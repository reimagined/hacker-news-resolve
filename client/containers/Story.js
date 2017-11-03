import React from 'react'
import uuid from 'uuid'
import url from 'url'
import { Link } from 'react-router-dom'
import plur from 'plur'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import sanitizer from 'sanitizer'
import styled, { css } from 'styled-components'

import Splitter from '../components/Splitter'
import actions from '../actions/storiesActions'
import TimeAgo from '../components/TimeAgo'

export const StoryText = styled.div`
  color: #000;
  font-size: 14px;
  padding-left: 1.25em;
  padding-top: 1.25em;
`

export const TitleRoot = styled.div`
  display: inline-block;
  color: #000;
  font-size: 8pt;
`

export const StyledLink = styled(Link)`font-size: 10pt;`

export const StyledExternalLink = styled.a`font-size: 10pt;`

export const StoryInfoRoot = styled.div`
  color: #666;
  font-size: 8pt;
  padding-left: 1.25em;
`

const infoLinkStyles = `
  display: inline-block;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const UnvoteLink = styled.div(infoLinkStyles)

export const DiscussLink = styled(Link)(infoLinkStyles)

export const UpvoteArrow = styled.div`
  display: inline-block;
  width: 0px;
  height: 0px;
  border: 0px;
  border-width: 4px;
  border-bottom-width: 7px;
  border-style: solid;
  border-color: transparent;
  margin-right: 5px;

  ${props =>
    !props.hidden &&
    css`
      border-bottom-color: #9a9a9a;
      cursor: pointer;
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

export const Title = ({ title, link, upvoteStory, voted, loggedIn }) => {
  const isExternal = isExternalLink(link)

  return (
    <TitleRoot>
      {loggedIn && !voted ? (
        <UpvoteArrow onClick={upvoteStory} title="upvote" />
      ) : (
        <UpvoteArrow hidden />
      )}
      {isExternal ? (
        <StyledExternalLink href={link}>{title}</StyledExternalLink>
      ) : (
        <StyledLink to={link}>{title}</StyledLink>
      )}{' '}
      {isExternal ? `(${getHostname(link)})` : null}
    </TitleRoot>
  )
}

export const StoryInfo = props => {
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
    <StoryInfoRoot>
      {votes ? `${votes.length} ${plur('point', votes.length)} ` : null}
      {createdBy ? (
        [
          'by ',
          <Username key="username" href={`/user/${createdBy}`}>
            {createdByName}
          </Username>,
          ' '
        ]
      ) : null}
      <TimeAgo createdAt={createdAt} />
      {unvoteIsVisible && (
        <span>
          <Splitter />
          <UnvoteLink onClick={unvoteStory}>unvote</UnvoteLink>{' '}
        </span>
      )}
      <Splitter />
      <DiscussLink to={`/storyDetails/${id}`}>
        {commentCount > 0 ? (
          `${commentCount} ${plur('comment', commentCount)}`
        ) : (
          'discuss'
        )}
      </DiscussLink>{' '}
    </StoryInfoRoot>
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
        <StoryInfo
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
          <StoryText
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
