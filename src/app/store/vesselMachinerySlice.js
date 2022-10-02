import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  add,
  edit,
  editSubCategories,
  fetchAll,
  fetchById,
  exportVesselMachinery,
  remove,
  exportAllVesselMachinery,
  copyAllMachinery
} from '../services/vesselMachineryService';
import {fetchAll as fetchAllVessels} from '../services/vesselService';
import VesselMachinery from '../core/models/VesselMachinery';
import Meta from '../core/models/Meta';
import Transform from '../utils/Transformer';
import Vessel from '../core/models/Vessel';

const FileDownload = require('js-file-download');

const initialState = {
  data: new VesselMachinery(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle',
  deleted: false,
  vesselList: [],
  vesselMeta: new Meta(),
  vesselListStatus: 'idle',
  copyStatus: 'idle'
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

export const vesselMachineriesDeleteAsync = createAsyncThunk(
  'vesselMachinery/deleteVesselMachineries',
  async (data) => {
    return await remove(data);
  }
);

export const vesselMachineryEditSubCategoriesAsync = createAsyncThunk(
  'vesselMachinery/editSubCategories',
  async (data) => {
    const response = await editSubCategories(data);
    return Transform.fetchObject(response.data, VesselMachinery);
  }
);

export const vesselMachineryExportAllAsync = createAsyncThunk(
  'vesselMachinery/exportAllVesselMachinery',
  async (params) => {
    const allVesselMachinery = await exportAllVesselMachinery(params);
    FileDownload(allVesselMachinery, 'All Vessel Machinery.xls');
    return allVesselMachinery;
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

export const vesselListAsync = createAsyncThunk(
  'vesselMachinery/fetchAllVessels',
  async (params) => {
    const response = await fetchAllVessels(params);
    const data = Transform.fetchCollection(response.data, Vessel);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const vesselMachineryCopyAsync = createAsyncThunk(
  'vesselMachinery/copyAllMachinery',
  async (params) => {
    const response = await copyAllMachinery(params);
    return response.data;
  }
);

export const vesselMachinerySlice = createSlice({
  name: 'vesselMachinery',
  initialState,
  reducers: {
    setDeletedStatus: (state, action) => {
      state.deleted = action.payload;
    },
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
      .addCase(vesselMachineriesDeleteAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(vesselMachineriesDeleteAsync.fulfilled, (state, action) => {
        state.deleted = action.payload.delete;
      })
      .addCase(vesselMachineriesDeleteAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
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
      })
      .addCase(vesselListAsync.pending, (state) => {
        state.vesselListStatus = 'loading';
      })
      .addCase(vesselListAsync.fulfilled, (state, action) => {
        state.vesselListStatus = 'idle';
        state.vesselList = action.payload.data;
        state.vesselMeta = action.payload.meta;
      })
      .addCase(vesselListAsync.rejected, (state, action) => {
        state.vesselListStatus = 'idle';
      })
      .addCase(vesselMachineryCopyAsync.pending, (state) => {
        state.copyStatus = 'loading';
      })
      .addCase(vesselMachineryCopyAsync.fulfilled, (state, action) => {
        state.copyStatus = 'idle';
      })
      .addCase(vesselMachineryCopyAsync.rejected, (state, action) => {
        state.copyStatus = 'idle';
      });
  },
});

export const {setDeletedStatus, resetVesselMachinery} = vesselMachinerySlice.actions;

export const vesselMachineryData = state => state.vesselMachinery.data;
export const vesselMachineryList = state => state.vesselMachinery.list;
export const vesselMachineryMeta = state => state.vesselMachinery.meta;
export const vesselMachineriesDeleted = state => state.vesselMachinery.deleted;
export const reqListStatus = state => state.vesselMachinery.listStatus;
export const reqDataStatus = state => state.vesselMachinery.dataStatus;
export const vesselList = state => state.vesselMachinery.vesselList;
export const vesselMeta = state => state.vesselMachinery.vesselMeta;
export const reqVesselListStatus = state => state.vesselMachinery.vesselListStatus;
export const reqCopyStatus = state => state.vesselMachinery.copyStatus;

export default vesselMachinerySlice.reducer;
