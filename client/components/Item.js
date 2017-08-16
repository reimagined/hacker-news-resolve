import React from 'react';
import url from 'url';
import { Link } from 'react-router-dom';
import plur from 'plur';
import '../styles/item.css';

const isExternalLink = link => link[0] !== '/';

function getHostname(link) {
  return link.split('.')[0] === 'www'
    ? link.substr(4)
    : url.parse(link).hostname;
}

const Title = ({ title, link, onUpvote, voted }) => {
  if (isExternalLink(link)) {
    return (
      <div className="item__title">
        {!voted && // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a href="" onClick={onUpvote} className="votearrow" title="upvote" />}
        <a href={link}>{title}</a>{' '}
        <span className="item__host">({getHostname(link)})</span>
      </div>
    );
  }
  return (
    <div className="item__title">
      {!voted && // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a href="" onClick={onUpvote} className="votearrow" title="upvote" />}
      <Link to={link}>
        {title}
      </Link>
    </div>
  );
};

const Score = ({ score }) => {
  return (
    <span className="item__score">
      {score} {plur('point', score)}{' '}
    </span>
  );
};

const PostedBy = ({ user }) => {
  return (
    <span className="item__by">
      by <a href={`/user?id=${user.id}`}>{user.name}</a>{' '}
    </span>
  );
};

const Comment = ({ storyId, commentCount }) => {
  return (
    <span>
      <span>
        |{' '}
        <Link to={`/story?id=${storyId}`}>
          {commentCount > 0
            ? `${commentCount} ${plur('comment', commentCount)}`
            : 'discuss'}
        </Link>{' '}
      </span>
    </span>
  );
};

const Meta = props => {
  const { storyId, user, date, score, commentCount, voted, onUnvote } = props;
  return (
    <div className="item__meta">
      {score ? <Score score={score} /> : ''}
      {user ? <PostedBy user={user} /> : ''}
      <span className="item__time">
        {date.toLocaleString('en-US')}{' '}
      </span>
      {/* TODO: timeAgo */}
      {voted &&
        <span>
          |{' '}
          <a href="" onClick={onUnvote}>
            unvote
          </a>{' '}
        </span>}
      {commentCount !== undefined
        ? <Comment storyId={storyId} commentCount={commentCount} />
        : ''}
    </div>
  );
};

const Item = props => {
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
    voted
  } = props;

  return (
    <div className="item">
      <div className="item__content">
        <Title voted={voted} onUpvote={onUpvote} title={title} link={link} />
        <Meta
          voted={voted}
          storyId={id}
          user={user}
          date={date}
          score={score}
          commentCount={commentCount}
          onUnvote={onUnvote}
        />
      </div>
    </div>
  );
};

export default Item;
