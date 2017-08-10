import React from 'react';

import ItemComponent from './ItemComponent';

const AskComponent = () => {
  return (
    <div>
      <div className="Items">
        <ol className="Items__list" start="1">
          <li className="ListItem">
            <ItemComponent
              id="5"
              title="Ask HN: What are real Ruby on Rails alternatives in 2017?"
              link="/item?id=14974767"
              user="rubyfan"
              date={new Date()}
              score={18}
              commentCount={31}
              newCommentCount={0}
            />
          </li>
          <li className="ListItem">
            <ItemComponent
              id="6"
              title="Ask HN: How are 3D printing related startups doing lately?"
              link="/item?id=14976263"
              user="rm2904"
              date={new Date()}
              score={4}
              commentCount={1}
              newCommentCount={0}
            />
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AskComponent;
