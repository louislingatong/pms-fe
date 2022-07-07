import React from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoginForm from '../form/LoginForm';
import {errorFlag} from '../../../store/authSlice';
import {Alert} from 'adminlte-2-react';

function Login() {
  const isError = useSelector(errorFlag);

  return (
    <div className="login-box-body">
      <p className="login-box-msg">Sign in to start your session</p>
      {
        isError &&
        <Alert closable type="danger">Invalid credentials!</Alert>
      }
      <LoginForm/>
      <Link to="/password/forgot">I forgot my password</Link>
    </div>
  );
}

export default Login;
