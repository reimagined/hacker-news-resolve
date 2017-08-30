import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import Comments from './Comments';
import Submit from './Submit';
import Login from '../components/Login';
import StoryDetails from './StoryDetails';
import Error from '../components/Error';
import Reply from './Reply';
import Stories from './Stories';
import Comment from './Comment';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import * as userActions from '../actions/userActions';
import * as uiActions from '../actions/ui';

import '../styles/style.css';
import '../styles/root.css';

export class RootComponent extends React.Component {
  componentDidMount() {
    this.props.history.listen(({ pathname, ...other }) => {
      if (pathname === '/submit') {
        this.props.onSubmitViewShown();
      }
    });
  }

  render() {
    const { user, logout } = this.props;

    return (
      <div className="app">
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
        <div className="app__wrap">
          <div className="app__header">
            <Link to="/" className="app__logo">
              <img src="/static/img/logo.png" width="16" height="16" alt="" />
            </Link>{' '}
            <Link
              className="app__link app__homelink"
              to="/"
              activeClassName="app__link--active"
            >
              reSolve HN
            </Link>{' '}
            <NavLink
              className="app__link"
              to="/newest"
              activeClassName="app__link--active"
            >
              new
            </NavLink>
            {' | '}
            <NavLink
              className="app__link"
              to="/comments"
              activeClassName="app__link--active"
            >
              comments
            </NavLink>
            {' | '}
            <NavLink
              className="app__link"
              to="/show"
              activeClassName="app__link--active"
            >
              show
            </NavLink>
            {' | '}
            <NavLink
              className="app__link"
              to="/ask"
              activeClassName="app__link--active"
            >
              ask
            </NavLink>
            {' | '}
            <NavLink
              className="app__link"
              to="/submit"
              activeClassName="app__link--active"
            >
              submit
            </NavLink>
            <div style={{ float: 'right' }}>
              {user && user.id ? (
                <div>
                  <NavLink
                    className="app__link"
                    to={`/user?id=${user.id}`}
                    activeClassName="app__link--active"
                  >
                    {user.name}
                  </NavLink>
                  {' | '}
                  <NavLink
                    className="app__link"
                    to="/"
                    activeClassName="app__link--active"
                    onClick={logout}
                  >
                    logout
                  </NavLink>
                </div>
              ) : (
                <NavLink
                  className="app__link"
                  to="/login"
                  activeClassName="app__link--active"
                >
                  login
                </NavLink>
              )}
            </div>
          </div>
          <div className="app__content">
            <Switch>
              <Route exact path="/newest" component={Stories} />
              <Route exact path="/show" component={Stories} />
              <Route exact path="/ask" component={Stories} />
              <Route exact path="/comments" component={Comments} />
              <Route exact path="/comment" component={Comment} />
              <Route exact path="/submit" component={Submit} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/user" component={Profile} />
              <Route exact path="/changepw" component={ChangePassword} />
              <Route exact path="/error" component={Error} />
              <Route path="/storyDetails" component={StoryDetails} />
              <Route path="/reply" component={Reply} />
              <Route component={Stories} />
            </Switch>
          </div>
          <div className="app__footer">
            <a
              className="app__footer-link"
              href="https://github.com/reimagined/hacker-news-demo"
            >
              reimagined/hacker-news-demo
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = ({ user }) => ({
  user
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout: userActions.logout,
      onSubmitViewShown: uiActions.submitViewShown
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RootComponent)
);
