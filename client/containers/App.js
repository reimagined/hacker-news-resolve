import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActions from '../actions/userActions'
import * as uiActions from '../actions/uiActions'

import '../styles/style.css'
import '../styles/root.css'

export class App extends React.PureComponent {
  componentDidMount() {
    this.props.history.listen(({ pathname }) => {
      if (pathname === '/submit') {
        this.props.onSubmitViewShown()
      }
    })
  }

  render() {
    const { children, user, loggedIn, logout } = this.props

    return (
      <div className="app">
        <Helmet>
          <title>reSolve Hacker News</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/img/reSolve-logo.svg"
          />
          <link rel="stylesheet" type="text/css" href="/static/bundle.css" />
        </Helmet>
        <div className="app__wrap">
          <div className="app__header">
            <Link to="/" className="app__logo">
              <img
                src="/static/img/reSolve-logo.svg"
                width="18"
                height="18"
                alt=""
              />
            </Link>{' '}
            <NavLink
              className="app__link app__homelink"
              to="/"
              activeClassName="app__link--active"
            >
              reSolve HN
            </NavLink>{' '}
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
            {loggedIn ? (
              <span>
                {' | '}
                <NavLink
                  className="app__link"
                  to="/submit"
                  activeClassName="app__link--active"
                >
                  submit
                </NavLink>
              </span>
            ) : null}
            <div style={{ float: 'right' }}>
              {loggedIn ? (
                <div>
                  <NavLink
                    className="app__link"
                    to={`/user/${user.id}`}
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
          <div className="app__content">{children}</div>
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
    )
  }
}

export const mapStateToProps = ({ user }) => ({
  user,
  loggedIn: !!user.id
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout: userActions.logout,
      onSubmitViewShown: uiActions.submitViewShown
    },
    dispatch
  )

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
