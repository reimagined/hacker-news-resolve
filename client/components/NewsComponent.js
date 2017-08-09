import React from 'react';
import url from 'url';
import { Link } from 'react-router-dom';

const isExternalLink = link => link[0] !== '/';

function getHostname(link) {
    const urlObj = url.parse(link); //TODO: check is empty
    return (urlObj.hostname.split('.')[0] === 'www') ? urlObj.hostname.substr(4) : urlObj.hostname;
};

const ItemTitle = ({ title, link }) => {
    if (isExternalLink(link)) {
        return <div className="Item__title">
                <a href={link}>{title}</a> <span className="Item__host">({getHostname(link)})</span>
            </div>;
    }
    return <div className="Item__title">
            <Link to={link}>{title}</Link>
        </div>;
};


const ItemMeta = ({ score }) => {
    return <div className="Item__meta">
      <span className="Item__score">
        {score} points
      </span>
    </div>;
};

const NewsItem = ({ title, link, user, score, commentCount }) => {
    return <li className="ListItem">
        <div className="Item">
            <div className="Item__content">
                <ItemTitle title={title} link={link} />
                <ItemMeta user={user} score={score} commentCount={commentCount} />
            </div>
        </div>
    </li>;
};

const NewsComponent = ({ items }) => {
    return <div>
        <div className="Items">
            <ol className="Items__list" start="1">
                <NewsItem title="Event Sourcing" link="https://martinfowler1.com/eaaDev/EventSourcing.html" user="admin" score="777" comments="777" />
                <NewsItem title="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th1.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="admin" score="10" comments="1" />
            </ol>
        </div>
    </div>;
};

export default NewsComponent;
