import React from 'react'
import { graphql, gql } from 'react-apollo'
import styled from 'styled-components'

import '../styles/profile.css'

const Wrapper = styled.div`
  padding-left: 3em;
  padding-right: 1.25em;
  margin-top: 1em;
  margin-bottom: 0.5em;
`

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 55px;
  padding: 5px 0;
`

const Content = styled.div`
  display: inline-block;
  vertical-align: middle;
`

export const UserById = ({ data: { user } }) => {
  if (!user) {
    return null
  }

  return (
    <Wrapper>
      <Label>name:</Label>
      <Content>{user.name}</Content>
      <br />
      <Label>created:</Label>
      <Content>{new Date(+user.createdAt).toLocaleString('en-US')}</Content>
    </Wrapper>
  )
}

export default graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        id
        name
        createdAt
      }
    }
  `,
  {
    options: ({ match: { params: { userId } } }) => ({
      variables: {
        id: userId
      }
    })
  }
)(UserById)
