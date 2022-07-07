import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import ForgotPasswordForm from '../form/ForgotPasswordForm';
import {successFlag, errorFlag} from '../../../store/authSlice';
import {Alert} from 'adminlte-2-react';

function ForgotPassword() {
  const isSuccess = useSelector(successFlag);
  const isError = useSelector(errorFlag);

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
