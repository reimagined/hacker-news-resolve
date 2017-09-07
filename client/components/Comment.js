import React from 'react'
import { Link } from 'react-router-dom'
import sanitizer from 'sanitizer'
import TimeAgo from 'react-timeago'

import UserName from '../containers/UserName'
import '../styles/comment.css'

class Comment extends React.PureComponent {
  state = {
    expanded: true
  }

  expand = () => this.setState({ expanded: !this.state.expanded })

  render() {
    const {
      id,
      storyId,
      level,
      text,
      createdBy,
      createdAt,
      showReply,
      parent,
      children
    } = this.props

    if (!id) {
      return null
    }

    return (
      <div>
        <div className={`comment comment--level${Math.min(level, 15)}`}>
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
                {' '}
                <Link
                  className="comment__link comment__user"
                  to={`/user/${createdBy}`}
                >
                  <UserName userId={createdBy} />
                </Link>
              </span>
              <span>
                {' '}
                <TimeAgo date={new Date(+createdAt)} />
              </span>
              <span>
                {' '}
                |{' '}
                <Link
                  className="comment__link"
                  to={`/storyDetails/${storyId}/comments/${id}`}
                >
                  link
                </Link>
              </span>
              {parent && (
                <span>
                  {' '}
                  |{' '}
                  <Link className="comment__link" to={parent}>
                    parent
                  </Link>
                </span>
              )}
            </div>
            {this.state.expanded ? (
              <div className="comment__text">
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizer.sanitize(text)
                  }}
                />
                <p>
                  {showReply && (
                    <Link
                      className="comment__reply"
                      to={`/storyDetails/${storyId}/comments/${id}/reply`}
                    >
                      reply
                    </Link>
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {this.state.expanded ? children : null}
      </div>
    )
  }

  static defaultProps = {
    level: 0
  }
}

export default Comment
