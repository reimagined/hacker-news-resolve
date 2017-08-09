import React from 'react';
import url from 'url';

const NewsItem = ({ index, id, caption, link, user, points, comments }) => {
    return <div className="Item">
      {caption}
    </div>;
}

// <div className="Item__content">
//         {caption}
//         {this.renderItemMeta(item, (threadStore.lastVisit !== null && threadStore.newCommentCount > 0 && <span>{' '}
//           (<em>{threadStore.newCommentCount} new</em> in the last <TimeAgo date={threadStore.lastVisit} formatter={timeUnitsAgo}/>{') | '}
//           <span className="control" tabIndex="0" onClick={this.autoCollapse} onKeyPress={this.autoCollapse} title="Collapse threads without new comments">
//             auto collapse
//           </span>{' | '}
//           <span className="control" tabIndex="0" onClick={this.markAsRead} onKeyPress={this.markAsRead}>
//             mark as read
//           </span>
//         </span>))}
//         {item.text && <div className="Item__text">
//           <div dangerouslySetInnerHTML={{__html: item.text}}/>
//         </div>}
//         {item.type === 'poll' && <div className="Item__poll">
//           {item.parts.map(function(id) {
//             return <PollOption key={id} id={id}/>
//           })}
//         </div>}
//       </div>
//        {item.kids && <div className="Item__kids">
//         {item.kids.map(function(id, index) {
//           return <Comment key={id} id={id} level={0}
//             loadingSpinner={index === 0}
//             threadStore={threadStore}
//           />
//         })}
//       </div>} 

const NewsComponent = ({ items }) => {
    return <div>
            <h1>News</h1>
            <NewsItem index="1" id="1" caption="Event Sourcing" link="https://martinfowler.com/eaaDev/EventSourcing.html" user="admin" points="777" comments="777" />
            <NewsItem index="2" id="2" caption="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="admin" points="10" comments="1" />
        </div>;
}

export default NewsComponent
