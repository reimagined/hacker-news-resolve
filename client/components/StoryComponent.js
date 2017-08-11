import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import uuid from 'uuid';
import ItemComponent from './ItemComponent';
import actions from '../actions/comments';

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
  pool
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
              <Link to={`/reply/id=${id}`}>reply</Link>
            </p>
          </div>
        </div>
      </div>
      {getChilrenCallback
        ? getChilrenCallback({ parent: id, level: level ? level + 1 : 1, pool })
        : null}
    </div>
  );
};

const getChildren = ({ parent, level, pool }) => {
  // TODO: state and remove level
  if (level > 5) return [];
  return [
    {
      id: 1,
      level,
      content: `Sub comment. level = ${level}. ${pool.state}`,
      user: 'sub user',
      date: new Date(),
      expanded: true
    }
  ];
};

function getChilComponents({ parent, level, pool }) {
  const child = getChildren({ parent, level, pool });
  return child.reduce((result, { id, content, user, date, expanded }) => {
    return (
      <CommentComponent
        id={id}
        level={level}
        content={content}
        user={user}
        date={date}
        expanded={expanded}
        getChilrenCallback={getChilComponents}
        pool={pool}
      />
    );
  }, null);
}

const pool = { state: 'This my state variable' }; //TODO:

class StoryComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  onAddComment(parentId, userId) {
    this.props.onAddComment({
      text: this.state.text,
      parentId,
      userId
    });
    this.setState({ text: '' });
  }

  render() {
    const id = this.props.location.pathname.split('=')[1];
    const story = this.props.news[id];
    const userName = this.props.users[story.userId].name;
    const link = story.type === 'question' ? `/item/id=${id}` : story.link;

    return (
      <div className="Item">
        <ItemComponent
          id={id}
          title={story.title}
          link={link}
          date={new Date(story.createDate)}
          score={story.voted.length}
          user={userName}
          commentCount={story.comments.length}
        />
        <div className="Item__content">
          <div className="Item__title">
            {story.text}
          </div>
          <textarea
            name="text"
            rows="6"
            cols="70"
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
          />
          <div>
            <button onClick={() => this.onAddComment(id, this.props.user.id)}>
              Add comment
            </button>
          </div>
        </div>
        <div className="Item__kids">
          <CommentComponent
            id={1}
            content="Test comment 1"
            user="roman"
            date={new Date()}
            getChilrenCallback={getChilComponents}
            pool={pool}
            expanded={1}
          />
          <CommentComponent
            id={2}
            content="Test comment 2"
            user="roman"
            date={new Date()}
          />
          <CommentComponent
            id={2}
            content="Test comment 2"
            user="roman"
            date={new Date()}
            expanded={0}
          />
          {story.comments.map(commentId => {
            const comment = this.props.comments[commentId];

            return (
              <CommentComponent
                id={comment.id}
                content={comment.text}
                user={this.props.users[comment.createdBy].name}
                date={new Date(comment.createdAt)}
                expanded={10}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    news: state.news,
    users: state.users,
    comments: state.comments,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddComment({ parentId, text, userId }) {
      return dispatch(
        actions.createComment(uuid.v4(), {
          text,
          parentId,
          userId
        })
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryComponent);
