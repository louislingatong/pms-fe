import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Interval from '../core/models/Interval';
import Meta from '../core/models/Meta';
import {add, edit, fetchAll, remove} from '../services/intervalService';
import Transform from '../utils/Transformer';
import {employeeActivateAsync} from "./employeeSlice";

const initialState = {
  data: new Interval(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle',
  deleted: false
};

export const intervalListAsync = createAsyncThunk(
  'interval/fetchAllIntervals',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, Interval);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const intervalAddAsync = createAsyncThunk(
  'interval/addNewInterval',
  async (data) => {
    const response = await add(data);
    return Transform.fetchObject(response.data, Interval);
  }
);

export const intervalEditAsync = createAsyncThunk(
  'interval/editInterval',
  async (data) => {
    const response = await edit(data);
    return Transform.fetchObject(response.data, Interval);
  }
);

export const intervalsDeleteAsync = createAsyncThunk(
  'interval/deleteIntervals',
  async (data) => {
    return await remove(data);
  }
);

export const intervalSlice = createSlice({
  name: 'interval',
  initialState,
  reducers: {
    setInterval: (state, action) => {
      state.data = action.payload;
    },
    setDeletedStatus: (state, action) => {
      state.deleted = action.payload;
    },
    resetInterval: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(intervalListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(intervalListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(intervalListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(intervalAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(intervalAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(intervalAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(intervalEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(intervalEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(intervalEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(intervalsDeleteAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(intervalsDeleteAsync.fulfilled, (state, action) => {
        state.deleted = action.payload.delete;
      })
      .addCase(intervalsDeleteAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      });
  },
});

export const {setInterval, setDeletedStatus, resetInterval} = intervalSlice.actions;

export const intervalData = state => state.interval.data;
export const intervalList = state => state.interval.list;
export const intervalMeta = state => state.interval.meta;
export const intervalsDeleted = state => state.interval.deleted;
export const reqListStatus = state => state.interval.listStatus;
export const reqDataStatus = state => state.interval.dataStatus;

export default intervalSlice.reducer;
