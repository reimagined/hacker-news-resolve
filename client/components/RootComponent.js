import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet';

import AskComponent from './AskComponent';
import CommentsComponent from './CommentsComponent';
import FlowComponent from './FlowComponent';
import JobsComponent from './JobsComponent';
import NewestComponent from './NewestComponent';
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
                <Link to="/" className="App__homelink">Resolve HN</Link>{' '}
                <NavLink to="/newest" activeClassName="active">new</NavLink>{' | '}
                <NavLink to="/comments" activeClassName="active">comments</NavLink> {' | '}
                <NavLink to="/show" activeClassName="active">show</NavLink>{' | '}
                <NavLink to="/ask" activeClassName="active">ask</NavLink>{' | '}
                <NavLink to="/jobs" activeClassName="active">jobs</NavLink>{' | '}
                <NavLink to="/submit" activeClassName="active">submit</NavLink>
            </div>
            <div className="App__content">
                <Switch>
                    <Route path="/newest" component={NewestComponent} />
                    <Route path="/comments" component={CommentsComponent} />
                    <Route path="/show" component={ShowComponent} />
                    <Route path="/ask" component={AskComponent} />
                    <Route path="/jobs" component={JobsComponent} />
                    <Route path="/submit" component={SubmitComponent} />
                    <Route component={FlowComponent} />
                </Switch>
            </div>
            <div className="App__footer">
                <a href="https://github.com/reimagined/hacker-news-demo">reimagined/hacker-news-demo</a>
            </div>
        </div>
    </div>;
