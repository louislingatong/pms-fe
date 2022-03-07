import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Interval from '../core/models/Interval';
import Meta from '../core/models/Meta';
import {
  fetchAll,
  add,
  edit
} from '../services/intervalService';
import Transform from '../utils/Transformer';

const initialState = {
  data: new Interval(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle'
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

export const intervalSlice = createSlice({
  name: 'interval',
  initialState,
  reducers: {
    setInterval: (state, action) => {
      state.data = action.payload;
    }
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
      });
  },
});

export const {setInterval} = intervalSlice.actions;

export const intervalData = state => state.interval.data;
export const intervalList = state => state.interval.list;
export const metaData = state => state.interval.meta;
export const reqListStatus = state => state.interval.listStatus;
export const reqDataStatus = state => state.interval.dataStatus;

export default intervalSlice.reducer;
