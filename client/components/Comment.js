import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sanitizer from 'sanitizer';
import TimeAgo from 'react-timeago';

import '../styles/comment.css';

export const getLevelClassName = level => {
  // TODO: remove me!!!
  if (level > 15) return 'comment--level15';
  return `comment--level${level > 0 ? level : '0'}`;
};

class Comment extends Component {
  state = {
    expanded: true
  };

  expand = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const {
      id,
      level,
      content,
      user,
      date,
      getChilrenCallback,
      showReply,
      replies,
      parent,
      root
    } = this.props;

    return (
      <div>
        <div className={`comment ${getLevelClassName(level)}`}>
          <div className="comment__content">
            <div className="comment__meta">
              <span
                onClick={this.expand}
                className="comment__collapse"
                tabIndex="0"
              >
                [{this.state.expanded ? '-' : '+'}]
              </span>
              <span>
                {' '}<Link
                  className="comment__link comment__user"
                  to={`/user/${user}`}
                >
                  {user}
                </Link>
              </span>
              <span>
                {' '}<TimeAgo date={date} />
              </span>
              <span>
                {' '}|{' '}
                <Link className="comment__link" to={`/comment?id=${id}`}>
                  link
                </Link>
              </span>
              {parent &&
                <span>
                  {' '}|{' '}
                  <Link className="comment__link" to={parent}>
                    parent
                  </Link>
                </span>}
              {root &&
                <span>
                  {' '}| on:{' '}
                  <Link
                    className="comment__link"
                    to={`/storyDetails?id=${root.id}`}
                  >
                    {root.title}
                  </Link>
                </span>}
            </div>
            {this.state.expanded &&
              <div className="comment__text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizer.sanitize(content)
                  }}
                />
                <p>
                  {showReply &&
                    <Link className="comment__reply" to={`/reply?id=${id}`}>
                      reply
                    </Link>}
                </p>
              </div>}
          </div>
        </div>
        {getChilrenCallback
          ? this.state.expanded &&
            getChilrenCallback({ replies, level: level ? level + 1 : 1 })
          : null}
      </div>
    );
  }
}

export default Comment;
