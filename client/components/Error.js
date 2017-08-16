import React from 'react';
import queryString from 'query-string';

export default ({ location }) =>
  <div>
    <h1>Error</h1>
    {queryString.parse(location.search).text}
  </div>;
