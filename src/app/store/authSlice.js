import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Http from '../utils/Http';
import {login, logout} from '../services/authService';

const initialState = {
  isAuthenticated: false,
  loginStatus: 'idle',
  logoutStatus: 'idle'
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await login(credentials);
    const {access_token, refresh_token} = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    Http.defaults.headers.common[ 'Authorization' ] = `Bearer ${access_token}`;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    await logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loginStatus = 'loading';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loginStatus = 'idle';
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loginStatus = 'idle';
      })
      .addCase(logoutAsync.pending, (state) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.logoutStatus = 'idle';
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.logoutStatus = 'idle';
      });
  },
});

export const {authenticate} = authSlice.actions;

export const authCheck = () => dispatch => {
  const accessToken = localStorage.getItem('accessToken');
  if (!!accessToken) {
    Http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    dispatch(authenticate(!!accessToken));
  }
};

export const authenticated = state => state.auth.isAuthenticated;
export const reqLoginStatus = state => state.auth.loginStatus;
export const reqLogoutStatus = state => state.auth.logoutStatus;

export default authSlice.reducer;
