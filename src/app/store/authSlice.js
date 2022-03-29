import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Http from '../utils/Http';
import {login, logout, forgotPassword, resetPassword} from '../services/authService';

const initialState = {
  isAuthenticated: false,
  loginStatus: 'idle',
  logoutStatus: 'idle',
  forgotPasswordStatus: 'idle',
  resetPasswordStatus: 'idle',
  successFlag: false,
  errorFlag: false
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await login(credentials);
    const {access_token, refresh_token} = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);

    Http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
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

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (data) => {
    return await forgotPassword(data);
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (data) => {
    return await resetPassword(data);
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearFlag: (state, action) => {
      state.successFlag = false;
      state.errorFlag = false;
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
        state.successFlag = true;
        state.errorFlag = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loginStatus = 'idle';
        state.successFlag = false;
        state.errorFlag = true;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        state.logoutStatus = 'idle';
        state.isAuthenticated = false;
        state.successFlag = true;
        state.errorFlag = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.logoutStatus = 'idle';
        state.successFlag = false;
        state.errorFlag = true;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.forgotPasswordStatus = 'loading';
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.forgotPasswordStatus = 'idle';
        state.successFlag = true;
        state.errorFlag = false;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.forgotPasswordStatus = 'idle';
        state.successFlag = false;
        state.errorFlag = true;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.resetPasswordStatus = 'loading';
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.resetPasswordStatus = 'idle';
        state.successFlag = true;
        state.errorFlag = false;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.resetPasswordStatus = 'idle';
        state.successFlag = false;
        state.errorFlag = true;
      });
  },
});

export const {authenticate, clearFlag} = authSlice.actions;

export const authCheck = () => dispatch => {
  const accessToken = localStorage.getItem('accessToken');
  if (!!accessToken) {
    Http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    dispatch(authenticate(!!accessToken));
  }
};

export const authenticated = state => state.auth.isAuthenticated;
export const successFlag = state => state.auth.successFlag;
export const errorFlag = state => state.auth.errorFlag;
export const reqLoginStatus = state => state.auth.loginStatus;
export const reqLogoutStatus = state => state.auth.logoutStatus;
export const reqForgotPasswordStatus = state => state.auth.forgotPasswordStatus;
export const reqResetPasswordStatus = state => state.auth.resetPasswordStatus;

export default authSlice.reducer;
