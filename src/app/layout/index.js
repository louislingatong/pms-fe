import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import {authenticated} from '../store/authSlice';
import {profileAsync, profileData} from '../store/profileSlice';

function Layout({children}) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authenticated);
  const profile = useSelector(profileData);

  useEffect(() => {
    if (isAuthenticated && !profile.id) {
      intProfile();
    }
  }, [isAuthenticated, profile]);

  const intProfile = () => {
    dispatch(profileAsync());
  };

  return (
    <React.Fragment>
      {
        isAuthenticated
          ? <PrivateLayout>{children}</PrivateLayout>
          : <PublicLayout>{children}</PublicLayout>
      }
    </React.Fragment>
  );
}

export default Layout;
