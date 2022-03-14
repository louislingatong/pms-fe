import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import VesselMachinerySubCategoryWork from '../core/models/VesselMachinerySubCategoryWork';
import Meta from '../core/models/Meta';
import {add, count, fetchAll} from '../services/workService';
import Transform from '../utils/Transformer';

const initialState = {
  count: {
    warning: 0,
    due: 0,
    overdue: 0
  },
  doneList: [],
  list: [],
  meta: new Meta(),
  countStatus: 'idle',
  doneListStatus: 'idle',
  listStatus: 'idle'
};

export const workListAsync = createAsyncThunk(
  'work/fetchAllWorks',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, VesselMachinerySubCategoryWork);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const workAddAsync = createAsyncThunk(
  'work/addNewWork',
  async (params) => {
    const response = await add(params);
    return Transform.fetchCollection(response.data, VesselMachinerySubCategoryWork);
  }
);

export const workCountAsync = createAsyncThunk(
  'work/countWorksByStatus',
  async (params) => {
    const response = await count(params);
    return response.data;
  }
);

export const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(workListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(workListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(workListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(workAddAsync.pending, (state) => {
        state.doneListStatus = 'loading';
      })
      .addCase(workAddAsync.fulfilled, (state, action) => {
        state.doneListStatus = 'idle';
        state.doneList = action.payload;
      })
      .addCase(workAddAsync.rejected, (state, action) => {
        state.doneListStatus = 'idle';
      })
      .addCase(workCountAsync.pending, (state) => {
        state.countStatus = 'loading';
      })
      .addCase(workCountAsync.fulfilled, (state, action) => {
        state.countStatus = 'idle';
        state.count = action.payload;
      })
      .addCase(workCountAsync.rejected, (state, action) => {
        state.countStatus = 'idle';
      });
  },
});

export const workCount = state => state.work.count;
export const workDoneList = state => state.work.doneList;
export const workList = state => state.work.list;
export const metaData = state => state.work.meta;
export const reqCountStatus = state => state.work.countStatus;
export const reqDoneListStatus = state => state.work.doneListStatus;
export const reqListStatus = state => state.work.listStatus;

export default workSlice.reducer;
