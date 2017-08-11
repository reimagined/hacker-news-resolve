import React from 'react';
import { connect } from 'react-redux';

import ItemComponent from './ItemComponent';

const ShowComponent = props => {
  return (
    <div>
      <div className="Items">
        <ol className="Items__list" start="1">
          <li className="ListItem">
            <ItemComponent
              id="3"
              title="Show HN: Transformation Invariant Reverse Image Search"
              link="https://pippy360.github.io/transformationInvariantImageSearch/"
              user="pippy360"
              date={new Date()}
              score={15}
              commentCount={3}
              newCommentCount={0}
            />
          </li>
          <li className="ListItem">
            <ItemComponent
              id="4"
              title="Launch HN: CocuSocial (YC S17) – Marketplace for cooking classes at restaurants"
              link="/item?id=14971205"
              user="ys1715"
              date={new Date()}
              score={47}
              commentCount={23}
              newCommentCount={1}
            />
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
                      commentCount={item.comments.length}
                    />
                  </li>
                );
              })}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default connect(state => ({ news: state.news, users: state.users }))(
  ShowComponent
);
