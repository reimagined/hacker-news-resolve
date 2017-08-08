import React from 'react';
import { Link } from 'react-router-dom';

const pages = {
    new: 'new',
    comments: 'comments',
    show: 'show',
    ask: 'ask',
    jobs: 'jobs',
    submit: 'submit'
};

export default () => 
    <div>
        {Object.keys(pages).map((id, index) =>
            <span key={id}>{index ? ' | ' : ''}<Link to={`/${id}`}>{pages[id]}</Link></span>
        )}
    </div>;
