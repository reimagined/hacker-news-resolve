import React from 'react';
import Stories from './Stories';

const NewestByPage = ({ match }) => <Stories page={match.params.page} />;

export default NewestByPage;
