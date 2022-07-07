import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {add, edit, editSubCategories, fetchAll, fetchById, exportVesselMachinery} from '../services/vesselMachineryService';
import VesselMachinery from '../core/models/VesselMachinery';
import Meta from '../core/models/Meta';
import Transform from '../utils/Transformer';

const FileDownload = require('js-file-download');

const initialState = {
  data: new VesselMachinery(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle'
};

export const vesselMachineryListAsync = createAsyncThunk(
  'vesselMachinery/fetchAllVesselMachinery',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, VesselMachinery);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const vesselMachineryDataAsync = createAsyncThunk(
  'vesselMachinery/fetchVesselMachinery',
  async (id) => {
    const response = await fetchById(id);
    return Transform.fetchObject(response.data, VesselMachinery);
  }
);

export const vesselMachineryAddAsync = createAsyncThunk(
  'vesselMachinery/addNewVesselMachinery',
  async (data) => {
    const response = await add(data);
    return Transform.fetchObject(response.data, VesselMachinery);
  }
);

export const vesselMachineryEditAsync = createAsyncThunk(
  'vesselMachinery/editVesselMachinery',
  async (data) => {
    const response = await edit(data);
    return Transform.fetchObject(response.data, VesselMachinery);
  }
);

export const vesselMachineryEditSubCategoriesAsync = createAsyncThunk(
  'vesselMachinery/editSubCategories',
  async (data) => {
    const response = await editSubCategories(data);
    return Transform.fetchObject(response.data, VesselMachinery);
  }
);

export const vesselMachineryExportAsync = createAsyncThunk(
  'vesselMachinery/exportVesselMachinery',
  async (id) => {
    const vesselMachinery = await exportVesselMachinery(id);
    FileDownload(vesselMachinery, 'Vessel Machinery.xls');
    return vesselMachinery;
  }
);

export const vesselMachinerySlice = createSlice({
  name: 'vesselMachinery',
  initialState,
  reducers: {
    resetVesselMachinery: (state, action) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(vesselMachineryListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(vesselMachineryListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(vesselMachineryListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(vesselMachineryDataAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselMachineryDataAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselMachineryDataAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselMachineryAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselMachineryAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselMachineryAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselMachineryEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselMachineryEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselMachineryEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselMachineryEditSubCategoriesAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselMachineryEditSubCategoriesAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(vesselMachineryEditSubCategoriesAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {resetVesselMachinery} = vesselMachinerySlice.actions;

export const vesselMachineryData = state => state.vesselMachinery.data;
export const vesselMachineryList = state => state.vesselMachinery.list;
export const metaData = state => state.vesselMachinery.meta;
export const reqListStatus = state => state.vesselMachinery.listStatus;
export const reqDataStatus = state => state.vesselMachinery.dataStatus;

export default vesselMachinerySlice.reducer;
