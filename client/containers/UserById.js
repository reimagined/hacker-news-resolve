import React from 'react'
import { gqlConnector } from 'resolve-redux'
import styled from 'styled-components'

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

export default gqlConnector(
  `
    query($id: ID!) {
      user(id: $id) {
        id
        name
        createdAt
      }
    }
  `,
  ({ match: { params: { userId } } }) => ({
    id: userId
  })
)(UserById)
