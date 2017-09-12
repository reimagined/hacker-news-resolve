import React from 'react'

import LoginForm from './LoginForm'

const Login = props => {
  return (
    <div>
      <LoginForm
        buttonText="login"
        action={`/login${props.location.search}`}
        title="Login"
      />
      <LoginForm
        buttonText="create account"
        action="/signup"
        title="Create account"
      />
    </div>
  )
}

export default Login
