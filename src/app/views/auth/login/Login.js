import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import LoginForm from '../form/LoginForm';
import {errorFlag, resetAuth} from '../../../store/authSlice';
import {resetEmployee} from '../../../store/employeeSlice';
import {resetInterval} from '../../../store/intervalSlice';
import {resetMachinery} from '../../../store/machinerySlice';
import {resetNavbarMenu} from '../../../store/navbarMenuSlice';
import {resetOption} from '../../../store/optionSlice';
import {resetPermission} from '../../../store/permissionSlice';
import {resetProfile} from '../../../store/profileSlice';
import {resetRunningHour} from '../../../store/runningHourSlice';
import {resetVesselMachinery} from '../../../store/vesselMachinerySlice';
import {resetVessel} from '../../../store/vesselSlice';
import {resetWork} from '../../../store/workSlice';
import {Alert} from 'adminlte-2-react';

function Login() {
  const dispatch = useDispatch();
  const isError = useSelector(errorFlag);

  useEffect(() => {
    dispatch(resetAuth());
    dispatch(resetEmployee());
    dispatch(resetInterval());
    dispatch(resetMachinery());
    dispatch(resetNavbarMenu());
    dispatch(resetOption());
    dispatch(resetPermission());
    dispatch(resetProfile());
    dispatch(resetRunningHour());
    dispatch(resetVesselMachinery());
    dispatch(resetVessel());
    dispatch(resetWork());
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
