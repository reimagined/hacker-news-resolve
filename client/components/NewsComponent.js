import React from 'react';
import url from 'url';

const NewsItem = ({ index, id, caption, link, user, points, comments }) => {
    const hourAgo = 5; // TODO:
    const urlObj = url.parse(link);
    const host = `${urlObj.protocol}//${urlObj.host}`;
    const hostName = (urlObj.hostname.split('.')[0] === 'www') ? urlObj.hostname.substr(4) : urlObj.hostname;
    
    return <div>
        {index}. <a href={link}>{caption}</a> &nbsp; &nbsp; 
        <small>
            (<a href={`?site=${host}`}>{hostName}</a>) |&nbsp;
            <span>{points} points by <a href="#TODO">{user}</a> <a href="#TODO">{hourAgo} hour ago</a></span> |&nbsp;
            <a href="#TODO">hide</a> |&nbsp;
            <a href="#TODO">{`${comments} comments`}</a>
        </small>
    </div>;
}

const NewsComponent = ({ items }) => {
    return <div>
            <h1>News</h1>
            <NewsItem index="1" id="1" caption="Event Sourcing" link="https://martinfowler.com/eaaDev/EventSourcing.html" user="admin" points="777" comments="777" />
            <NewsItem index="2" id="2" caption="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="admin" points="10" comments="1" />
        </div>;
}

export default NewsComponent
