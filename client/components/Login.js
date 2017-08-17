import React from 'react';

import LoginForm from './LoginForm';

const Login = () => {
  return (
    <div>
      <LoginForm buttonText="login" action="/login" title="Login" />
      <LoginForm buttonText="sign up" action="/signup" title="Sign up" />
    </div>
  );
};

export default Login;
