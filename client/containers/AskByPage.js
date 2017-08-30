import React from 'react';
import Stories from './Stories';

const AskByPage = ({ match }) => (
  <Stories page={match.params.page} type="ask" />
);

export default AskByPage;
