import React from 'react';
import LoginForm from '../form/LoginForm';

function Login() {
  return (
    <div className="login-box-body">
      <p className="login-box-msg">Sign in to start your session</p>
      <LoginForm/>
    </div>
  );
}

export default Login;
