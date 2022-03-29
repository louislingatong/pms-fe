import React, {useEffect}  from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import LoginForm from '../form/LoginForm';
import {clearFlag, errorFlag} from '../../../store/authSlice';
import {Alert} from 'adminlte-2-react';

function Login() {
  const dispatch = useDispatch();
  const isError = useSelector(errorFlag);

  useEffect(() => {
    dispatch(clearFlag());
  }, []);

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
