import React from 'react';
import { Link } from 'react-router-dom';

const ItemComponent = ({ id, content, user, date, rootLink, rootTitle }) => {
  return (
    <div>
      <div className="Comment Comment--level0">
        <div className="Comment__content">
          <div className="Comment__meta">
            <span>
              {' '}<a className="Comment__user" href={`/user/${user}`}>
                {user}
              </a>
            </span>
            <span>
              {' '}<time>{date.toLocaleString('en-US')}</time>
            </span>
            <span>
              {' '}| on: <Link to={rootLink}>{rootTitle}</Link>
            </span>
          </div>
          <div className="Comment__text">
            <div>
              {content}
            </div>
            <p>
              <Link to={`/reply?id=${id}`}>reply</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentsComponent = () => {
  return (
    <div>
      <ItemComponent
        id={3}
        content="Test comment 3"
        user="roman"
        date={new Date()}
        rootLink="/story/3"
        rootTitle="Show HN: Transformation Invariant Reverse Image Search"
      />
      <ItemComponent
        id={2}
        content="Test comment 2"
        user="roman"
        date={new Date()}
        rootLink="/story/2"
        rootTitle="Offline GraphQL Queries with Redux Offline and Apollo "
      />
      <ItemComponent
        id={1}
        content="Test comment 1"
        user="roman"
        date={new Date()}
        rootLink="/story/1"
        rootTitle="Event Sourcing"
      />
    </div>
  );
};

export default CommentsComponent;
