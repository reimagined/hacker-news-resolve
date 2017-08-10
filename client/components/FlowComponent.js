import React from 'react';

import ItemComponent from './ItemComponent';

const FlowComponent = ({ items }) => {
    return <div>
        <div className="Items">
            <ol className="Items__list" start="1">
                <li className="ListItem"><ItemComponent title="Event Sourcing" link="https://martinfowler1.com/eaaDev/EventSourcing.html" user="roman" date={new Date()} score={777} commentCount={777} newCommentCount={1} /></li>
                <li className="ListItem"><ItemComponent title="Offline GraphQL Queries with Redux Offline and Apollo" link="http://www.east5th1.co/blog/2017/07/24/offline-graphql-queries-with-redux-offline-and-apollo/" user="vlad" date={new Date()} score={1} commentCount={0} /></li>
                <li className="ListItem"><ItemComponent title="Show HN: Transformation Invariant Reverse Image Search" link="https://pippy360.github.io/transformationInvariantImageSearch/" user="pippy360" date={new Date()} score={15} commentCount={3} newCommentCount={0} /></li>
                <li className="ListItem"><ItemComponent title="Launch HN: CocuSocial (YC S17) – Marketplace for cooking classes at restaurants" link="/item?id=14971205" user="ys1715" date={new Date()} score={47} commentCount={23} newCommentCount={1} /></li>
                <li className="ListItem"><ItemComponent title="Ask HN: What are real Ruby on Rails alternatives in 2017?" link="/item?id=14974767" user="rubyfan" date={new Date()} score={18} commentCount={31} newCommentCount={0} /></li>
                <li className="ListItem"><ItemComponent title="Ask HN: How are 3D printing related startups doing lately?" link="/item?id=14976263" user="rm2904" date={new Date()} score={4} commentCount={1} newCommentCount={0} /></li>
                <li className="ListItem"><ItemComponent title="SendBird (YC W16) Is Hiring Solution Engineers in Redwood City" link="https://angel.co/sendbird/jobs/228945-solutions-engineer"date={new Date()} /></li>
                <li className="ListItem"><ItemComponent title="Drcrhono (YC W11) is hiring front- and back-end developers to fix healthcare" link="https://www.drchrono.com/careers/" date={new Date()} /></li>
            </ol>
        </div>
    </div>;
};

export default FlowComponent;
