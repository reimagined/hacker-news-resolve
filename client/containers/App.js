import React from 'react'
import { NavLink } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'

import Splitter from '../components/Splitter'
import LoginInfo from './LoginInfo'
import * as userActions from '../actions/userActions'
import * as uiActions from '../actions/uiActions'

const ContentRoot = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 8px auto;
  color: #000;
  background-color: #f5f5f5;
  font-size: 10pt;
  font-family: Verdana, Geneva, sans-serif;

  @media only screen and (max-width: 750px) and (min-width: 300px) {
    width: 100%;
    margin: 0px auto;
  }
`

const PageHeader = styled.div`
  color: #fff;
  background-color: #3949ab;
  padding: 6px;
  line-height: 18px;
  vertical-align: middle;
  position: relative;
`

const Link = styled(NavLink)`
  color: white;

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`

const PageTitle = styled.div`
  display: inline-block;
  font-weight: bold;
  color: #fff;
  margin-left: 0.25em;
  margin-right: 0.75em;

  @media only screen and (max-width: 750px) and (min-width: 300px) {
    display: none;
  }
`

const Content = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
`

const Footer = styled.div`
  margin-top: 1em;
  border-top: 1px solid #e7e7e7;
  text-align: center;
  padding: 6px 0;
`

const FooterLink = styled.a`
  color: #333;
  text-decoration: underline;
`

export class App extends React.PureComponent {
  componentDidMount() {
    this.props.history.listen(({ pathname }) => {
      if (pathname === '/submit') {
        this.props.onSubmitViewShown()
      }
    })
  }

  render() {
    const { children, logout } = this.props

    return (
      <div>
        <Helmet>
          <title>reSolve Hacker News</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/reSolve-logo.svg"
          />
          <link rel="stylesheet" type="text/css" href="/static/style.css" />
        </Helmet>
        <ContentRoot>
          <PageHeader>
            <Link to="/">
              <img
                src="/static/reSolve-logo.svg"
                width="18"
                height="18"
                alt=""
              />
            </Link>
            <Link to="/">
              <PageTitle>reSolve HN</PageTitle>
            </Link>{' '}
            <Link to="/newest">new</Link>
            <Splitter color="white" />
            <Link to="/comments">comments</Link>
            <Splitter color="white" />
            <Link to="/show">show</Link>
            <Splitter color="white" />
            <Link to="/ask">ask</Link>
            <Splitter color="white" />
            <Link to="/submit">submit</Link>
            <LoginInfo logout={logout} />
          </PageHeader>
          <Content>{children}</Content>
          <Footer>
            <FooterLink href="https://github.com/reimagined/hacker-news-resolve">
              reimagined/hacker-news-resolve
            </FooterLink>
          </Footer>
        </ContentRoot>
      </div>
    )
  }
}

export const mapStateToProps = ({ user = {} }) => ({
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
