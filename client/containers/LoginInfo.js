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

const LoginInfo = ({ data: { me }, logout }) => (
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

export default gqlConnector(`
  query {
    me {
      id
      name
    }
  }
`)(LoginInfo)
