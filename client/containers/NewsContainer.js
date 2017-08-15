import React from 'react';
import { connect } from 'react-redux';

import ItemComponent from '../components/ItemComponent';
import getCommentsCount from '../helpers/getCommentsCount';
import actions from '../actions/news';

const NewsContainer = props => {
  let news = Object.keys(props.news);
  if (props.location.pathname.includes('ask')) {
    news = news.filter(id => props.news[id].type === 'ask');
  } else if (props.location.pathname.includes('show')) {
    news = news.filter(id => props.news[id].type === 'show');
  } else if (props.location.pathname === '/') {
    // TODO sort flow news in some special order
  }

  return (
    <div>
      <div className="Items">
        <ol className="Items__list" start="1">
          {news.map(id => {
            const item = props.news[id];
            const type = item.type;

            const link = type === 'ask' ? `/story/id=${id}` : item.link;
            const title = type === 'ask' ? `Ask HN: ${item.title}` : item.title;

            const user = props.users[item.userId];
            return (
              <li key={id} className="ListItem">
                <ItemComponent
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
    </div>
  );
};

function mapStateToProps({ news, users, comments, user }) {
  return {
    news,
    users,
    user,
    comments
  };
}

function mapDispatchToProps(dispatch) {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsContainer);
