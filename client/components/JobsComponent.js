import React from 'react';

import ItemComponent from './ItemComponent';

const JobsComponent = () => {
  return (
    <div>
      <div className="Items">
        <ol className="Items__list" start="1">
          <li className="ListItem">
            <ItemComponent
              id="7"
              title="SendBird (YC W16) Is Hiring Solution Engineers in Redwood City"
              link="https://angel.co/sendbird/jobs/228945-solutions-engineer"
              date={new Date()}
            />
          </li>
          <li className="ListItem">
            <ItemComponent
              id="8"
              title="Drcrhono (YC W11) is hiring front- and back-end developers to fix healthcare"
              link="https://www.drchrono.com/careers/"
              date={new Date()}
            />
          </li>
        </ol>
      </div>
    </div>
  );
};

export default JobsComponent;
