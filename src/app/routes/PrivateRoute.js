import React, {Suspense} from 'react';
import {Redirect, Route, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Layout from '../layout';
import Loader from '../components/Loader';
import {authenticated} from '../store/authSlice';

function PrivateRoutes({component: Component, ...rest}) {
  const location = useLocation();
  const isAuthenticated = useSelector(authenticated);

  if (!isAuthenticated) {
    return (
      <Route {...rest} render={() =>
        <Redirect to={{
          pathname: '/login',
          state: {
            from: location.pathname
          }
        }}/>
      }/>
    )
  }

  return (
    <Route {...rest} render={(props) => {
      return (
        <Suspense fallback={<Loader/>}>
          <Layout>
            <Component {...props} path={rest.path} name={rest.name}/>
          </Layout>
        </Suspense>
      )
    }}/>
  );
}

export default PrivateRoutes;
