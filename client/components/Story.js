import React from 'react';
import url from 'url';
import { Link } from 'react-router-dom';
import plur from 'plur';

import '../styles/story.css';

const isExternalLink = link => link[0] !== '/';

export const getHostname = link =>
  link.split('.')[0] === 'www' ? link.substr(4) : url.parse(link).hostname;

export const Title = ({ title, link, onUpvote, voted, loggedIn }) => {
  const votearrowIsVisible = loggedIn && !voted;

  if (isExternalLink(link)) {
    return (
      <div className="story__title">
        {votearrowIsVisible && // eslint-disable-next-line jsx-a11y/anchor-has-content
          <span
            onClick={onUpvote}
            className="story__votearrow"
            title="upvote"
          />}
        <a href={link}>{title}</a>{' '}
        <span className="story__host">({getHostname(link)})</span>
      </div>
    );
  }
  return (
    <div className="story__title">
      {votearrowIsVisible && // eslint-disable-next-line jsx-a11y/anchor-has-content
        <span onClick={onUpvote} className="story__votearrow" title="upvote" />}
      <Link to={link}>
        {title}
      </Link>
    </div>
  );
};

export const Score = ({ score }) => {
  return (
    <span className="story__score">
      {score} {plur('point', score)}{' '}
    </span>
  );
};

export const PostedBy = ({ user }) => {
  return (
    <span className="story__by">
      by <a href={`/user?id=${user.id}`}>{user.name}</a>{' '}
    </span>
  );
};

export const Comment = ({ storyId, commentCount }) => {
  return (
    <span>
      <span>
        |{' '}
        <Link to={`/storyDetails?id=${storyId}`}>
          {commentCount > 0
            ? `${commentCount} ${plur('comment', commentCount)}`
            : 'discuss'}
        </Link>{' '}
      </span>
    </span>
  );
};

export const Meta = props => {
  const {
    storyId,
    user,
    date,
    score,
    commentCount,
    voted,
    loggedIn,
    onUnvote
  } = props;
  const unvoteIsVisible = voted && loggedIn;

  return (
    <div className="story__meta">
      {score ? <Score score={score} /> : ''}
      {user ? <PostedBy user={user} /> : ''}
      <span className="story__time">
        {date.toLocaleString('en-US')}{' '}
      </span>
      {/* TODO: timeAgo */}
      {unvoteIsVisible &&
        <span>
          |{' '}
          <span className="item__unvote" onClick={onUnvote}>
            unvote
          </span>{' '}
        </span>}
      {commentCount !== undefined
        ? <Comment storyId={storyId} commentCount={commentCount} />
        : ''}
    </div>
  );
};

const Story = props => {
  const {
    id,
    title,
    link,
    user,
    date,
    score,
    commentCount,
    onUpvote,
    onUnvote,
    voted,
    loggedIn
  } = props;

  return (
    <div className="story">
      <div className="story__content">
        <Title
          loggedIn={loggedIn}
          voted={voted}
          onUpvote={onUpvote}
          title={title}
          link={link}
        />
        <Meta
          voted={voted}
          storyId={id}
          user={user}
          date={date}
          score={score}
          commentCount={commentCount}
          onUnvote={onUnvote}
          loggedIn={loggedIn}
        />
      </div>
    </div>
  );
};

export default Story;
