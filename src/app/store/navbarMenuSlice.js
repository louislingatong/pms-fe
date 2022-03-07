import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Vessel from '../core/models/Vessel';
import {fetchAll} from '../services/vesselService';
import Transform from '../utils/Transformer';

const initialState = {
  vesselSubMenus: [],
  activeVesselSubMenu: new Vessel(),
  vesselSubMenusStatus: 'idle'
};

export const vesselListAsync = createAsyncThunk(
  'navbarMenu/fetchAllVessels',
  async (params) => {
    const response = await fetchAll(params);
    return Transform.fetchCollection(response.data, Vessel);
  }
);

export const navbarMenuSlice = createSlice({
  name: 'navbarMenu',
  initialState,
  reducers: {
    setSelectedVessel: (state, action) => {
      state.activeVesselSubMenu = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(vesselListAsync.pending, (state) => {
        state.vesselSubMenusStatus = 'loading';
      })
      .addCase(vesselListAsync.fulfilled, (state, action) => {
        state.vesselSubMenusStatus = 'idle';
        state.vesselSubMenus = action.payload;
        state.activeVesselSubMenu = action.payload.length ? action.payload[0] : new Vessel();
      })
      .addCase(vesselListAsync.rejected, (state, action) => {
        state.vesselSubMenusStatus = 'idle';
      });
  },
});

export const {setSelectedVessel} = navbarMenuSlice.actions;

export const vesselSubMenus = state => state.navbarMenu.vesselSubMenus;
export const activeVesselSubMenu = state => state.navbarMenu.activeVesselSubMenu;
export const reqVesselSubMenusStatus = state => state.navbarMenu.vesselSubMenusStatus;

export default navbarMenuSlice.reducer;
