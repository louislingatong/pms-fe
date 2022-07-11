import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Vessel from '../core/models/Vessel';
import Meta from '../core/models/Meta';
import {fetchAll} from '../services/vesselService';
import Transform from '../utils/Transformer';

const initialState = {
  vesselList: [],
  vesselMeta: new Meta(),
  activeVessel: new Vessel(),
  status: 'idle'
};

export const vesselListAsync = createAsyncThunk(
  'navbarMenu/fetchAllVessels',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, Vessel);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const navbarMenuSlice = createSlice({
  name: 'navbarMenu',
  initialState,
  reducers: {
    setSelectedVessel: (state, action) => {
      state.activeVessel = action.payload;
    },
    resetNavbarMenu: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(vesselListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(vesselListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.vesselList = action.payload.data;
        state.vesselMeta = action.payload.meta
        if (state.activeVessel.id === 0) {
          state.activeVessel = action.payload.data.length ? action.payload.data[0] : new Vessel();
        }
      })
      .addCase(vesselListAsync.rejected, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {setSelectedVessel, resetNavbarMenu} = navbarMenuSlice.actions;

export const vesselList = state => state.navbarMenu.vesselList;
export const vesselMeta = state => state.navbarMenu.vesselMeta;
export const activeVessel= state => state.navbarMenu.activeVessel;
export const reqStatus = state => state.navbarMenu.status;

export default navbarMenuSlice.reducer;
