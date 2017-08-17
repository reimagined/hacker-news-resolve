import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Item from '../components/Item';
import Paginator from '../components/Paginator';
import getCommentsCount from '../helpers/getCommentsCount';
import { getPageItems, hasNextItems } from '../helpers/getPageItems';
import actions from '../actions/stories';
import '../styles/stories.css';

const Stories = props => {
  let { page } = queryString.parse(props.location.search);

  let stories = Object.keys(props.stories).reverse();
  if (props.location.pathname.includes('ask')) {
    stories = stories.filter(id => props.stories[id].type === 'ask');
  } else if (props.location.pathname.includes('show')) {
    stories = stories.filter(id => props.stories[id].type === 'show');
  } else if (props.location.pathname === '/') {
    // TODO sort flow stories in some special order
  }

  const hasNext = hasNextItems(stories, page);
  stories = getPageItems(stories, page);

  return (
    <div>
      <div className="stories">
        <ol className="stories__list" start="1">
          {stories.map(id => {
            const item = props.stories[id];
            const type = item.type;

            const link = type === 'ask' ? `/storyDetails?id=${id}` : item.link;
            const title = type === 'ask' ? `Ask HN: ${item.title}` : item.title;

            const user = props.users[item.userId];
            return (
              <li key={id} className="stories__item">
                <Item
                  id={id}
                  title={title}
                  link={link}
                  date={new Date(item.createDate)}
                  score={item.voted.length}
                  user={user}
                  commentCount={getCommentsCount(props.comments, item.comments)}
                  voted={item.voted.includes(props.user.id)}
                  onUpvote={() => props.onUpvote(id, props.user.id)}
                  onUnvote={() => props.onUnvote(id, props.user.id)}
                />
              </li>
            );
          })}
        </ol>
      </div>
      <Paginator page={page} hasNext={hasNext} location={props.location} />
    </div>
  );
};

const mapStateToProps = ({ stories, users, comments, user }) => {
  return {
    stories,
    users,
    user,
    comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpvote(id, userId) {
      return dispatch(
        actions.upvoteStory(id, {
          userId
        })
      );
    },
    onUnvote(id, userId) {
      return dispatch(
        actions.unvoteStory(id, {
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
