import React from 'react';
import Stories from './Stories';

const ShowByPage = ({ match }) => (
  <Stories page={match.params.page} type="show" />
);

export default ShowByPage;
