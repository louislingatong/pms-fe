import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchProfile} from '../services/profileService';
import User from '../core/models/User';
import Transform from '../utils/Transformer';

const initialState = {
  data: new User(),
  dataStatus: 'idle'
};

export const profileAsync = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const response = await fetchProfile();
    const data = Transform.fetchObject(response.data, User)
    return {data};
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(profileAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload.data;
      })
      .addCase(profileAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {resetProfile} = profileSlice.actions;

export const profileData = state => state.profile.data;
export const reqDataStatus = state => state.profile.dataStatus;

export default profileSlice.reducer;
