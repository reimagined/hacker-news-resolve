import React from 'react';
import url from 'url';
import { Link } from 'react-router-dom';
import plur from 'plur';
import TimeAgo from 'react-timeago';

import '../styles/story.css';

const isExternalLink = link => link[0] !== '/';

export const getHostname = link =>
  link.split('.')[0] === 'www' ? link.substr(4) : url.parse(link).hostname;

const voteArrow = (visible, onUpvote) => {
  return visible ? (
    <span onClick={onUpvote} className="story__votearrow" title="upvote" />
  ) : (
    <span className="story__votearrow--hidden" />
  );
};

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
    );
  }
  return (
    <span className="story__title">
      <Link className="story__title-link" to={link}>
        {title}
      </Link>
    </span>
  );
};
export const Title = ({ title, link, onUpvote, voted, loggedIn }) => {
  return (
    <div>
      {voteArrow(loggedIn && !voted, onUpvote)}
      {getTitle({ title, link })}
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
    <span>
      by{' '}
      <a className="story__meta-link story__by" href={`/user?id=${user.id}`}>
        {user.name}
      </a>{' '}
    </span>
  );
};

export const Comment = ({ storyId, commentCount }) => {
  return (
    <span>
      <span>
        |{' '}
        <Link className="story__meta-link" to={`/storyDetails?id=${storyId}`}>
          {commentCount > 0 ? (
            `${commentCount} ${plur('comment', commentCount)}`
          ) : (
            'discuss'
          )}
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
        <TimeAgo date={date} />{' '}
      </span>
      {/* TODO: timeAgo */}
      {unvoteIsVisible && (
        <span>
          |{' '}
          <span className="item__unvote" onClick={onUnvote}>
            unvote
          </span>{' '}
        </span>
      )}
      {commentCount !== undefined ? (
        <Comment storyId={storyId} commentCount={commentCount} />
      ) : (
        ''
      )}
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
