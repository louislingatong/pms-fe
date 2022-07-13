import axios from 'axios';
import store from '../store';
import {authCheck} from '../store/authSlice';

// create new instance
const Http = axios.create();

// set default config
Http.defaults.baseURL = process.env.REACT_APP_API_URL;
Http.defaults.headers.common.Accept = 'application/json';

/**
 * intercept the response so we can handle the
 * expected exceptions from the API
 */
Http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    /**
     * This could be a CORS issue or
     * a dropped internet connection.
     */
    if (typeof error.response === 'undefined') {
      return alert('A network error occurred.');
    }

    switch (error.response.status) {
      case 401:
      case 403:
        const state = store.getState();
        if (state.auth.isAuthenticated) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          store.dispatch(authCheck());
        }
        break;
      case 500:
      case 562:
      case 563:
      case 567:
      case 568:
      case 570:
        if (error.response.data && error.response.data.error) {
          // store.dispatch(showNotification(error.response.data.error, false));
        }
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

export default Http;
