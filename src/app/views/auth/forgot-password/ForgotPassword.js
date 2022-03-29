import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import ForgotPasswordForm from '../form/ForgotPasswordForm';
import {successFlag, errorFlag, clearFlag} from '../../../store/authSlice';
import {Alert} from 'adminlte-2-react';

function ForgotPassword() {
  const dispatch = useDispatch();
  const isSuccess = useSelector(successFlag);
  const isError = useSelector(errorFlag);

  useEffect(() => {
    dispatch(clearFlag());
  }, []);

  return (
    <div className="login-box-body">
      <p className="login-box-msg">Forgot Password</p>
      {
        isSuccess &&
        <Alert closable type="success">A reset password link has been sent to you via email.</Alert>
      }
      {
        isError &&
        <Alert closable type="danger">Invalid email!</Alert>
      }
      <ForgotPasswordForm/>
      <Link to="/login">Back to login</Link>
    </div>
  );
}

export default ForgotPassword;
