import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import VesselMachineryRunningHour from '../core/models/VesselMachineryRunningHour';
import Meta from '../core/models/Meta';
import {
  add,
  fetchAll,
  exportRunningHours,
  exportRunningHoursHistory
} from '../services/runningHourService';
import Transform from '../utils/Transformer';

const FileDownload = require('js-file-download');

const initialState = {
  data: new VesselMachineryRunningHour(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle',
};

export const runningHourListAsync = createAsyncThunk(
  'runningHour/fetchAllRunningHours',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, VesselMachineryRunningHour);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const runningHourAddAsync = createAsyncThunk(
  'runningHour/addNewRunningHours',
  async (params) => {
    const response = await add(params);
    return Transform.fetchObject(response.data, Meta);
  }
);

export const runningHoursExportAsync = createAsyncThunk(
  'runningHour/exportRunningHours',
  async (params) => {
    const runningHours = await exportRunningHours(params);
    FileDownload(runningHours, 'Running Hours.xls');
    return runningHours;
  }
);

export const runningHourHistoryExportAsync = createAsyncThunk(
  'runningHour/exportRunningHoursHistory',
  async (id) => {
    const runningHoursHistory = await exportRunningHoursHistory(id);
    FileDownload(runningHoursHistory, 'Running Hours History.xls');
    return runningHoursHistory;
  }
);

export const runningHourSlice = createSlice({
  name: 'runningHour',
  initialState,
  reducers: {
    resetRunningHour: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(runningHourListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(runningHourListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(runningHourListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(runningHourAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(runningHourAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(runningHourAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {resetRunningHour} = runningHourSlice.actions;

export const runningHourData = state => state.runningHour.data;
export const runningHourList = state => state.runningHour.list;
export const runningHourMeta = state => state.runningHour.meta;
export const reqListStatus = state => state.runningHour.listStatus;
export const reqDataStatus = state => state.runningHour.dataStatus;

export default runningHourSlice.reducer;
