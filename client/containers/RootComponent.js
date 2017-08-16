import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import Comments from './Comments';
import Jobs from '../components/Jobs';
import Submit from './Submit';
import Login from '../components/Login';
import Story from './Story';
import Error from '../components/Error';
import Reply from './Reply';
import News from './News';
import Comment from './Comment';
import User from './User';
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
          <Route exact path="/newest" component={News} />
          <Route exact path="/show" component={News} />
          <Route exact path="/ask" component={News} />
          <Route exact path="/comments" component={Comments} />
          <Route exact path="/comment" component={Comment} />
          <Route exact path="/jobs" component={Jobs} />
          <Route exact path="/submit" component={Submit} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/user" component={User} />
          <Route exact path="/error" component={Error} />
          <Route path="/story" component={Story} />
          <Route path="/reply" component={Reply} />
          <Route component={News} />
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
