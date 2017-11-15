import React from 'react'
import { gqlConnector } from 'resolve-redux'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Splitter from '../components/Splitter'

const Link = styled(NavLink)`
  color: white;

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`

const PageAuth = styled.div`float: right;`

class LoginInfo extends React.PureComponent {
  render() {
    const { data: { me }, logout } = this.props

    return (
      <PageAuth>
        {me ? (
          <div>
            <Link to={`/user/${me.id}`}>{me.name}</Link>
            <Splitter color="white" />
            <Link to="/" onClick={logout}>
              logout
            </Link>
          </div>
        ) : (
          <Link to="/login">login</Link>
        )}
      </PageAuth>
    )
  }
}

export default gqlConnector(`
  query {
    me {
      id
      name
    }
  }
`)(LoginInfo)
