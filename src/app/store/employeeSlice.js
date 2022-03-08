import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Employee from '../core/models/Employee';
import Meta from '../core/models/Meta';
import {add, edit, fetchAll, fetchById} from '../services/employeeService';
import Transform from '../utils/Transformer';

const initialState = {
  data: new Employee(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle'
};

export const employeeListAsync = createAsyncThunk(
  'employee/fetchAllEmployees',
  async (params) => {
    const response = await fetchAll(params);
    const data = Transform.fetchCollection(response.data, Employee);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const employeeDataAsync = createAsyncThunk(
  'employee/fetchEmployee',
  async (id) => {
    const response = await fetchById(id)
    return Transform.fetchObject(response.data, Employee);
  }
);

export const employeeAddAsync = createAsyncThunk(
  'employee/addNewEmployee',
  async (data) => {
    const response = await add(data);
    return Transform.fetchObject(response.data, Employee);
  }
);

export const employeeEditAsync = createAsyncThunk(
  'employee/editEmployee',
  async (data) => {
    const response = await edit(data);
    return Transform.fetchObject(response.data, Employee);
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeData: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(employeeListAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(employeeListAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(employeeListAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(employeeDataAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(employeeDataAsync.fulfilled, (state, action) => {
        state.listStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeeDataAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(employeeAddAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(employeeAddAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeeAddAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(employeeEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(employeeEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeeEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {setEmployeeData} = employeeSlice.actions;

export const employeeData = state => state.employee.data;
export const employeeList = state => state.employee.list;
export const metaData = state => state.employee.meta;
export const reqListStatus = state => state.employee.listStatus;
export const reqDataStatus = state => state.employee.dataStatus;

export default employeeSlice.reducer;
