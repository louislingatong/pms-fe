import React from 'react';
import {Redirect, Router as ReactRouter, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import routes from './routes';

const history = createBrowserHistory();

function RoutesComp() {
  return (
    <ReactRouter history={history}>
      <Switch>
        {
          routes.map((route, i) => {
            if (route.invalid) {
              return <Redirect key={i} to={{pathname: '/login'}}/>
            }
            if (route.auth) {
              return <PrivateRoute exact key={i} {...route} />
            }
            return <PublicRoute exact key={i} {...route} />
          })
        }
      </Switch>
    </ReactRouter>
  );
}

export default RoutesComp;
