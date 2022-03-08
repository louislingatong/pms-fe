import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {add, addSubCategory, edit, fetchAll} from '../services/machineryService';
import Machinery from '../core/models/Machinery';
import Meta from '../core/models/Meta';
import Transform from '../utils/Transformer';

const initialState = {
  data: new Machinery(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle'
};

export const machineryListAsync = createAsyncThunk(
  'machinery/fetchAllMachinery',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, Machinery);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const machineryAddAsync = createAsyncThunk(
  'machinery/addNewMachinery',
  async (data) => {
    const response = await add(data);
    return Transform.fetchObject(response.data, Machinery);
  }
);

export const machineryEditAsync = createAsyncThunk(
  'machinery/editMachinery',
  async (data) => {
    const response = await edit(data);
    return Transform.fetchObject(response.data, Machinery);
  }
);

export const machineryAddSubCategoryAsync = createAsyncThunk(
  'machinery/addNewSubCategory',
  async (data) => {
    const response = await addSubCategory(data);
    return Transform.fetchObject(response.data, Machinery);
  }
);

export const machinerySlice = createSlice({
  name: 'machinery',
  initialState,
  reducers: {
    setMachinery: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(machineryListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(machineryListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(machineryListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(machineryAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(machineryAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(machineryAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(machineryEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(machineryEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(machineryEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(machineryAddSubCategoryAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(machineryAddSubCategoryAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(machineryAddSubCategoryAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {setMachinery} = machinerySlice.actions;

export const machineryData = state => state.machinery.data;
export const machineryList = state => state.machinery.list;
export const metaData = state => state.machinery.meta;
export const reqListStatus = state => state.machinery.listStatus;
export const reqDataStatus = state => state.machinery.dataStatus;

export default machinerySlice.reducer;
