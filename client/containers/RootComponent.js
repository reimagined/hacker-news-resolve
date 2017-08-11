import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import AskComponent from '../components/AskComponent';
import CommentsComponent from '../components/CommentsComponent';
import FlowComponent from '../components/FlowComponent';
import JobsComponent from '../components/JobsComponent';
import NewestComponent from '../components/NewestComponent';
import ShowComponent from '../components/ShowComponent';
import SubmitComponent from '../components/SubmitComponent';
import LoginComponent from '../components/LoginComponent';
import StoryComponent from '../components/StoryComponent';
import * as userActions from '../actions/userActions';

import '../styles/style.css';

export const RootComponent = ({ user, logout, match }) =>
  <div className="App">
    <Helmet>
      <meta
        name="viewport"
        content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="/static/img/favicon.ico"
      />
      <link rel="stylesheet" type="text/css" href="/static/bundle.css" />
    </Helmet>
    <div className="App__wrap">
      <div className="App__header">
        <Link to="/" className="App__homelinkicon">
          <img src="/static/img/logo.png" width="16" height="16" alt="" />
        </Link>{' '}
        <Link to="/" className="App__homelink">
          Resolve HN
        </Link>{' '}
        <NavLink to="/newest" activeClassName="active">
          new
        </NavLink>
        {' | '}
        <NavLink to="/comments" activeClassName="active">
          comments
        </NavLink>
        {' | '}
        <NavLink to="/show" activeClassName="active">
          show
        </NavLink>
        {' | '}
        <NavLink to="/ask" activeClassName="active">
          ask
        </NavLink>
        {' | '}
        <NavLink to="/jobs" activeClassName="active">
          jobs
        </NavLink>
        {' | '}
        <NavLink to="/submit" activeClassName="active">
          submit
        </NavLink>
        <div style={{ float: 'right' }}>
          {user && user.id
            ? <NavLink to="/" activeClassName="active" onClick={logout}>
                logout
              </NavLink>
            : <NavLink to="/login" activeClassName="active">
                login
              </NavLink>}
        </div>
      </div>
      <div className="App__content">
        <Switch>
          <Route exact path="/newest" component={NewestComponent} />
          <Route exact path="/comments" component={CommentsComponent} />
          <Route exact path="/show" component={ShowComponent} />
          <Route exact path="/ask" component={AskComponent} />
          <Route exact path="/jobs" component={JobsComponent} />
          <Route exact path="/submit" component={SubmitComponent} />
          <Route exact path="/login" component={LoginComponent} />
          <Route exact path="/story" component={StoryComponent} />
          <Route component={FlowComponent} />
        </Switch>
      </div>
      <div className="App__footer">
        <a href="https://github.com/reimagined/hacker-news-demo">
          reimagined/hacker-news-demo
        </a>
      </div>
    </div>
  </div>;

export const mapStateToProps = ({ user }) => ({
  user
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout: userActions.logout
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RootComponent)
);
