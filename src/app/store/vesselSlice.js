import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Vessel from '../core/models/Vessel';
import Meta from '../core/models/Meta';
import {add, edit, fetchAll, fetchById} from '../services/vesselService';
import Transform from '../utils/Transformer';

const initialState = {
  data: new Vessel(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle'
};

export const vesselListAsync = createAsyncThunk(
  'vessel/fetchAllVessels',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, Vessel);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const vesselDataAsync = createAsyncThunk(
  'vessel/fetchVessel',
  async (id) => {
    const response = await fetchById(id)
    return Transform.fetchObject(response.data, Vessel);
  }
);

export const vesselAddAsync = createAsyncThunk(
  'vessel/AddNewVessel',
  async (data) => {
    const response = await add(data)
    return Transform.fetchObject(response.data, Vessel);
  }
);

export const vesselEditAsync = createAsyncThunk(
  'vessel/EditVessel',
  async (data) => {
    const response = await edit(data)
    return Transform.fetchObject(response.data, Vessel);
  }
);

export const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {
    setVesselData: (state, action) => {
      state.data = action.payload;
    },
    resetVessel: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(vesselListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(vesselListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(vesselListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(vesselDataAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselDataAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselDataAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {setVesselData, resetVessel} = vesselSlice.actions;

export const vesselData = state => state.vessel.data;
export const vesselList = state => state.vessel.list;
export const metaData = state => state.vessel.meta;
export const reqListStatus = state => state.vessel.listStatus;
export const reqDataStatus = state => state.vessel.dataStatus;

export default vesselSlice.reducer;
