import React from 'react';
import url from 'url';
import { Link } from 'react-router-dom';
import plur from 'plur';

const isExternalLink = link => link[0] !== '/';

function getHostname(link) {
    const urlObj = url.parse(link); //TODO: check is empty
    return (urlObj.hostname.split('.')[0] === 'www') ? urlObj.hostname.substr(4) : urlObj.hostname;
};

const Title = ({ title, link }) => {
    if (isExternalLink(link)) {
        return <div className="Item__title">
                <a href={link}>{title}</a> <span className="Item__host">({getHostname(link)})</span>
            </div>;
    }
    return <div className="Item__title">
            <Link to={link}>{title}</Link>
        </div>;
};

const Score = ({ score }) => {
    return <span className="Item__score">{score} {plur('point', score)} </span>;
};

const PostedBy = ({ user }) => {
    return <span className="Item__by">by <a href="#TODO">{user}</a> </span>;
};

const Comment = ({ commentCount, newCommentCount }) => {
        return <span>
                <span>| <Link to="#TODO">{(commentCount > 0) ? `${commentCount} ${plur('comment', commentCount)}` : 'discuss'}</Link> </span>
                {(newCommentCount > 0) 
                    ? <span className="ListItem__newcomments"><Link to="#TODO">{newCommentCount} new</Link> </span>
                    : ''}
            </span>;
};

const Meta = ({ user, date, score, commentCount, newCommentCount }) => {
    return <div className="Item__meta">
            {(score) ? <Score score={score} /> : ''}
            {(user) ? <PostedBy user={user} /> : ''}
            <span className="Item__time">{date.toLocaleString()} </span>
            {(commentCount !== undefined) ? <Comment commentCount={commentCount} newCommentCount={newCommentCount} /> : ''}
        </div>;
};

const ItemComponent = ({ title, link, user, date, score, commentCount, newCommentCount }) => {
    return <div className="Item">
        <div className="Item__content">
            <Title title={title} link={link} />
            <Meta user={user} date={date} score={score} commentCount={commentCount} newCommentCount={newCommentCount} />
        </div>
    </div>;
};

export default ItemComponent;
