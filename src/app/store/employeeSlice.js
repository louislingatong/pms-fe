import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Employee from '../core/models/Employee';
import Meta from '../core/models/Meta';
import {
  activate,
  add,
  assignVessels,
  deactivate,
  edit,
  editPermissions,
  fetchAll,
  fetchById
} from '../services/employeeService';
import {fetchAll as fetchAllPermissions} from '../services/permissionService';
import {fetchAll as fetchAllVessels} from '../services/vesselService';
import Transform from '../utils/Transformer';
import Vessel from "../core/models/Vessel";
import Permission from "../core/models/Permission";

const initialState = {
  data: new Employee(),
  list: [],
  meta: new Meta(),
  listStatus: 'idle',
  dataStatus: 'idle',
  permissionList: [],
  permissionMeta: new Meta(),
  vesselList: [],
  vesselMeta: new Meta(),
  statusChanged: false
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

export const employeeActivateAsync = createAsyncThunk(
  'employee/activateEmployee',
  async (data) => {
    return await activate(data);
  }
);

export const employeeDeactivateAsync = createAsyncThunk(
  'employee/deactivateEmployee',
  async (data) => {
    return await deactivate(data);
  }
);

export const permissionListAsync = createAsyncThunk(
  'employee/fetchAllPermissions',
  async (params) => {
    const response = await fetchAllPermissions(params);
    const data = Transform.fetchCollection(response.data, Permission);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const employeePermissionEditAsync = createAsyncThunk(
  'employee/editEmployeePermission',
  async (data) => {
    const response = await editPermissions(data);
    return Transform.fetchObject(response.data, Employee);
  }
);

export const vesselListAsync = createAsyncThunk(
  'employee/fetchAllVessels',
  async (params) => {
    const response = await fetchAllVessels(params);
    const data = Transform.fetchCollection(response.data, Vessel);
    const meta = Transform.fetchObject(response.meta, Meta);
    return {data, meta};
  }
);

export const employeeVesselAssignAsync = createAsyncThunk(
  'employee/assignEmployeeVessel',
  async (data) => {
    const response = await assignVessels(data);
    return Transform.fetchObject(response.data, Employee);
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeData: (state, action) => {
      state.data = action.payload;
    },
    setEmployeeStatus: (state, action) => {
      state.statusChanged = action.payload;
    },
    resetEmployee: (state, action) => initialState
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
        state.dataStatus = 'loading';
      })
      .addCase(employeeDataAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeeDataAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
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
      })
      .addCase(employeeActivateAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(employeeActivateAsync.fulfilled, (state, action) => {
        state.statusChanged = action.payload.activated;
      })
      .addCase(employeeActivateAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(employeeDeactivateAsync.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(employeeDeactivateAsync.fulfilled, (state, action) => {
        state.statusChanged = action.payload.deactivated;
      })
      .addCase(employeeDeactivateAsync.rejected, (state, action) => {
        state.listStatus = 'idle';
      })
      .addCase(permissionListAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(permissionListAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.permissionList = action.payload.data;
        state.permissionMeta = action.payload.meta;
      })
      .addCase(permissionListAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(employeePermissionEditAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(employeePermissionEditAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeePermissionEditAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(vesselListAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(vesselListAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.vesselList = action.payload.data;
        state.vesselMeta = action.payload.meta;
      })
      .addCase(vesselListAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      })
      .addCase(employeeVesselAssignAsync.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(employeeVesselAssignAsync.fulfilled, (state, action) => {
        state.dataStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(employeeVesselAssignAsync.rejected, (state, action) => {
        state.dataStatus = 'idle';
      });
  },
});

export const {setEmployeeData, setEmployeeStatus, resetEmployee} = employeeSlice.actions;

export const employeeData = state => state.employee.data;
export const employeeList = state => state.employee.list;
export const employeeMeta = state => state.employee.meta;
export const permissionList = state => state.employee.permissionList;
export const permissionMeta = state => state.employee.permissionMeta;
export const vesselList = state => state.employee.vesselList;
export const vesselMeta = state => state.employee.vesselMeta;
export const reqListStatus = state => state.employee.listStatus;
export const reqDataStatus = state => state.employee.dataStatus;
export const statusChanged = state => state.employee.statusChanged;

export default employeeSlice.reducer;
