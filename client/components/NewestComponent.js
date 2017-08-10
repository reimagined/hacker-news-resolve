import React from 'react';

import ItemComponent from './ItemComponent';

const NewestComponent = () => {
    return <div>
        <div className="Items">
            <ol className="Items__list" start="1">
                <li className="ListItem"><ItemComponent id="1" title="Event Sourcing" link="https://martinfowler1.com/eaaDev/EventSourcing.html" user="roman" date={new Date()} score={777} commentCount={777} newCommentCount={1} /></li>
                <li className="ListItem"><ItemComponent id="2" title="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th1.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="vlad" date={new Date()} score={1} commentCount={0} /></li>
            </ol>
        </div>
    </div>;

};

export default NewestComponent;
