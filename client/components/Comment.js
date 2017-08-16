import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/comment.css';

const getLevelClassName = level => {
  // TODO: remove me!!!
  if (level > 15) return 'comment--level15';
  return `comment--level${level > 0 ? level : '0'}`;
};

const ExpandButton = ({ expanded, onClick }) => {
  return (
    <span onClick={onClick} className="comment__collapse" tabindex="0">
      [{expanded ? '-' : '+'}]
    </span>
  );
};

class Comment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: true
    };
  }
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
              <ExpandButton
                onClick={() =>
                  this.setState({ expanded: !this.state.expanded })}
                expanded={this.state.expanded}
              />
              <span>
                {' '}<Link className="comment__user" to={`/user/${user}`}>
                  {user}
                </Link>
              </span>
              <span>
                {' '}<time>{date.toLocaleString('en-US')}</time>
              </span>
              <span>
                {' '}| <Link to={`/comment?id=${id}`}>link</Link>
              </span>
              {parent &&
                <span>
                  {' '}| <Link to={parent}>parent</Link>
                </span>}
              {root &&
                <span>
                  {' '}| on:{' '}
                  <Link to={`/story?id=${root.id}`}>{root.title}</Link>
                </span>}
            </div>
            {this.state.expanded &&
              <div className="comment__text">
                <div>
                  {content}
                </div>
                <p>
                  {showReply && <Link to={`/reply?id=${id}`}>reply</Link>}
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
