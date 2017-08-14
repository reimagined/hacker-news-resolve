import React from 'react';
import { Link } from 'react-router-dom';

const getLevelClassName = level => {
  // TODO: remove me!!!
  if (level > 15) return 'Comment--level15';
  return `Comment--level${level > 0 ? level : '0'}`;
};

const ExpandButton = ({ expanded }) => {
  return (
    <span className="Comment__collapse" tabindex="0">
      [{expanded ? '-' : '+'}]
    </span>
  );
};

const CommentComponent = ({
  id,
  level,
  content,
  user,
  date,
  expanded,
  getChilrenCallback,
  showReply,
  replies
}) => {
  return (
    <div>
      <div
        className={`Comment ${getLevelClassName(level)} ${expanded
          ? null
          : 'Comment--collapsed'}`}
      >
        <div className="Comment__content">
          <div className="Comment__meta">
            <ExpandButton expanded={expanded} />
            <span>
              {' '}<a className="Comment__user" href={`/user/${user}`}>
                {user}
              </a>
            </span>
            <span>
              {' '}<time>{date.toLocaleString('en-US')}</time>
            </span>
            <span>
              {' '}| <a href={`/comment/${id}`}>link</a>
            </span>
          </div>
          <div className="Comment__text">
            <div>
              {content}
            </div>
            <p>
              {showReply && <Link to={`/reply/id=${id}`}>reply</Link>}
            </p>
          </div>
        </div>
      </div>
      {getChilrenCallback
        ? getChilrenCallback({ replies, level: level ? level + 1 : 1 })
        : null}
    </div>
  );
};

export default CommentComponent;
