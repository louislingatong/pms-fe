import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchAll} from '../services/permissionService';
import Permission from '../core/models/Permission';
import Transform from '../utils/Transformer';

const initialState = {
  list: [],
  listStatus: 'idle'
};

export const permissionListAsync = createAsyncThunk(
  'permission/fetchAllPermissions',
  async () => {
    const response = await fetchAll();
    const data = Transform.fetchCollection(response.data, Permission);
    return {data}
  }
);

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    resetPermission: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(permissionListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(permissionListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
      })
      .addCase(permissionListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      });
  },
});

export const {resetPermission} = permissionSlice.actions;

export const permissionList = state => state.permission.list;
export const reqListStatus = state => state.permission.listStatus;

export default permissionSlice.reducer;
