import React from 'react'

import AuthForm from './AuthForm'

const Login = props => {
  return (
    <div>
      <AuthForm
        buttonText="login"
        action={`${process.env.ROOT_DIR}/login${props.location.search}`}
        title="Login"
      />
      <AuthForm
        buttonText="create account"
        action={`${process.env.ROOT_DIR}/register`}
        title="Create account"
      />
    </div>
  )
}

export default Login
