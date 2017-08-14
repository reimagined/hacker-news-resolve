import React from 'react';
import { connect } from 'react-redux';

import ItemComponent from './ItemComponent';
import getCommentsCount from '../helpers/getCommentsCount';

const ShowComponent = props => {
  return (
    <div>
      <div className="Items">
        <ol className="Items__list" start="1">
          {Object.keys(props.news)
            .filter(id => props.news[id].type === 'show')
            .map(id => {
              const item = props.news[id];
              const userName = props.users[item.userId].name;
              return (
                <li key={id} className="ListItem">
                  <ItemComponent
                    id={id}
                    title={item.title}
                    link={item.link}
                    date={new Date(item.createDate)}
                    score={item.voted.length}
                    user={userName}
                    commentCount={getCommentsCount(
                      props.comments,
                      item.comments
                    )}
                  />
                </li>
              );
            })}
        </ol>
      </div>
    </div>
  );
};

export default connect(({ news, users, comments }) => ({
  news,
  users,
  comments
}))(ShowComponent);
