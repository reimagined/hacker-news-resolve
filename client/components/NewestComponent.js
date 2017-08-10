import React from 'react';
import { connect } from 'react-redux'

import ItemComponent from './ItemComponent';

const NewestComponent = (props) => {
    return <div>
        <div className="Items">
            <ol className="Items__list" start="1">
                <li className="ListItem"><ItemComponent id="1" title="Event Sourcing" link="https://martinfowler1.com/eaaDev/EventSourcing.html" user="roman" date={new Date()} score={777} commentCount={777} newCommentCount={1} /></li>
                <li className="ListItem"><ItemComponent id="2" title="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th1.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="vlad" date={new Date()} score={1} commentCount={0} /></li>
                {
                    Object.keys(props.news).map(id => {
                        const item = props.news[id];
                        const userName = props.users[item.userId].name;
                        return (<li key={id} className="ListItem">
                            <ItemComponent id={id} title={item.title} link={item.link} date={new Date(item.createDate)} score={item.voted.length} user={userName} commentCount={item.comments.length} />
                        </li>);
                    })
                }
            </ol>
        </div>
    </div>;

};

export default connect(
    state => ({news: state.news, users: state.users})
)(NewestComponent);
