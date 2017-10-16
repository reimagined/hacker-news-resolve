import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-left: 3em;
  padding-right: 1.25em;
  margin-top: 1em;
  margin-bottom: 0.83em;
`

const Header = styled.div`
  display: block;
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  margin-left: 0px;
  margin-right: 0px;
  font-weight: bold;
`

const Content = styled.div`
  display: block;
  margin-bottom: 0.83em;
`

const AuthForm = ({ title, action, buttonText }) => (
  <Wrapper>
    <Header>{title}</Header>
    <form method="POST" action={action}>
      <Content>
        username: <input type="text" name="name" />
      </Content>
      <input type="submit" value={buttonText} />
    </form>
  </Wrapper>
)

export default AuthForm
