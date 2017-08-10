import React from 'react';

import ItemComponent from './ItemComponent';

const ShowComponent = () => {
    return <div>
        <div className="Items">
            <ol className="Items__list" start="1">
                <li className="ListItem"><ItemComponent title="Show HN: Transformation Invariant Reverse Image Search" link="https://pippy360.github.io/transformationInvariantImageSearch/" user="pippy360" date={new Date()} score={15} commentCount={3} newCommentCount={0} /></li>
                <li className="ListItem"><ItemComponent title="Launch HN: CocuSocial (YC S17) – Marketplace for cooking classes at restaurants" link="/item?id=14971205" user="ys1715" date={new Date()} score={47} commentCount={23} newCommentCount={1} /></li>
            </ol>
        </div>
    </div>;
}

export default ShowComponent;
