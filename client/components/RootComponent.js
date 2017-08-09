import React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet';

import AskComponent from './AskComponent';
import CommentsComponent from './CommentsComponent';
import JobsComponent from './JobsComponent';
import NewsFlowComponent from './NewsFlowComponent';
import NewsComponent from './NewsComponent';
import ShowComponent from './ShowComponent';
import SubmitComponent from './SubmitComponent';

import '../styles/style.css';

const bundleCssSource = process.env.NODE_ENV === 'production'
        ? '/static/bundle.css'
        : 'http://localhost:3001/bundle.css';

export default () => 
    <div className="App">
        <Helmet>
            <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="shortcut icon" type="image/x-icon" href={`/static/img/favicon.ico`} />
            <link rel="stylesheet" type="text/css" href={bundleCssSource} />
        </Helmet>
        <div className="App__wrap">
            <div className="App__header">
                <Link to="/" className="App__homelinkicon"><img src="/static/img/logo.png" width="16" height="16" alt="" /></Link>{' '}
                <Link to="/" className="App__homelink">React HN</Link>{' '}
                <Link to="/flow">new</Link>{' | '}
                <Link to="/comments">comments</Link> {' | '}
                <Link to="/show">show</Link>{' | '}
                <Link to="/ask">ask</Link>{' | '}
                <Link to="/jobs">jobs</Link>
            </div>
            <div className="App__content">
                <Switch>
                    <Route path="/flow" component={NewsFlowComponent} />
                    <Route path="/comments" component={CommentsComponent} />
                    <Route path="/show" component={ShowComponent} />
                    <Route path="/ask" component={AskComponent} />
                    <Route path="/jobs" component={JobsComponent} />
                    <Route path="/submit" component={SubmitComponent} />
                    <Route component={NewsComponent} />
                </Switch>
            </div>
            <div className="App__footer">
                <a href="https://github.com/insin/react-hn">insin/react-hn</a>
            </div>
        </div>
    </div>;
