import React from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ResetPasswordForm from '../form/ResetPasswordForm';
import {successFlag, errorFlag} from '../../../store/authSlice';
import {Alert} from 'adminlte-2-react';
import queryString from 'query-string';

function ResetPassword(props) {
  const isSuccess = useSelector(successFlag);
  const isError = useSelector(errorFlag);

  const token = queryString.parse(props.location.search, { ignoreQueryPrefix: true }).token;

  return (
    <div className="login-box-body">
      <p className="login-box-msg">Reset Password</p>
      {
        isSuccess &&
        <Alert closable type="success">Your password for signing in has been changed successfully.<br/>
          <Link to="/login">Login</Link>
        </Alert>
      }
      {
        isError &&
        <Alert closable type="danger">Invalid/Expired password reset token!</Alert>
      }
      <ResetPasswordForm token={token}/>
    </div>
  );
}

export default ResetPassword;
