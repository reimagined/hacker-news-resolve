import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Item from '../components/Item';
import Paginator from '../components/Paginator';
import getCommentsCount from '../helpers/getCommentsCount';
import { getPageItems, hasNextItems } from '../helpers/getPageItems';
import actions from '../actions/news';
import '../styles/news.css';

const News = props => {
  let { page } = queryString.parse(props.location.search);

  let news = Object.keys(props.news).reverse();
  if (props.location.pathname.includes('ask')) {
    news = news.filter(id => props.news[id].type === 'ask');
  } else if (props.location.pathname.includes('show')) {
    news = news.filter(id => props.news[id].type === 'show');
  } else if (props.location.pathname === '/') {
    // TODO sort flow news in some special order
  }

  const hasNext = hasNextItems(news, page);
  news = getPageItems(news, page);

  return (
    <div>
      <div className="news">
        <ol className="news__list" start="1">
          {news.map(id => {
            const item = props.news[id];
            const type = item.type;

            const link = type === 'ask' ? `/story?id=${id}` : item.link;
            const title = type === 'ask' ? `Ask HN: ${item.title}` : item.title;

            const user = props.users[item.userId];
            return (
              <li key={id} className="news__item">
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

const mapStateToProps = ({ news, users, comments, user }) => {
  return {
    news,
    users,
    user,
    comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpvote(id, userId) {
      return dispatch(
        actions.upvoteNews(id, {
          userId
        })
      );
    },
    onUnvote(id, userId) {
      return dispatch(
        actions.unvoteNews(id, {
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
