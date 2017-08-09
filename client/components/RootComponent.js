import React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import AskComponent from './AskComponent';
import CommentsComponent from './CommentsComponent';
import JobsComponent from './JobsComponent';
import NewsFlowComponent from './NewsFlowComponent';
import NewsComponent from './NewsComponent';
import ShowComponent from './ShowComponent';
import SubmitComponent from './SubmitComponent';

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
        <h2><Link to="/">Hacker News</Link></h2>
        <div>
            <Link to="/flow">new</Link> |&nbsp;
            <Link to="/comments">comments</Link> |&nbsp;
            <Link to="/show">show</Link> |&nbsp;
            <Link to="/ask">ask</Link> |&nbsp;
            <Link to="/jobs">jobs</Link> |&nbsp;
            <Link to="/submit">submit</Link>
        </div>
        <Switch>
            <Route path="/flow" component={NewsFlowComponent} />
            <Route path="/comments" component={CommentsComponent} />
            <Route path="/show" component={ShowComponent} />
            <Route path="/ask" component={AskComponent} />
            <Route path="/jobs" component={JobsComponent} />
            <Route path="/submit" component={SubmitComponent} />
            <Route component={NewsComponent} />
        </Switch>
    </div>;
