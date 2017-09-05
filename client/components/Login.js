import React from 'react';

import LoginForm from './LoginForm';

const Login = () => {
  return (
    <div>
      <LoginForm buttonText="login" action="/login" title="Login" />
      <LoginForm
        buttonText="create account"
        action="/signup"
        title="Create account"
      />
    </div>
  );
};

export default Login;
