import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchAll as fetchAllVessels} from '../services/vesselService';
import {fetchAll as fetchAllVesselOwners} from '../services/vesselOwnerService';
import {fetchAll as fetchAllVesselDepartments} from '../services/vesselDepartmentService';
import {fetchAll as fetchAllMachineryModels} from '../services/machineryModelService';
import {fetchAll as fetchAllMachineryMakers} from '../services/machineryMakerService';
import {fetchAll as fetchAllMachineries} from '../services/machineryService';
import {fetchAll as fetchAllMachinerySubCategoryDescriptions} from '../services/machinerySubCategoryDescriptionService';
import {fetchAll as fetchAllIntervals} from '../services/intervalService';
import {fetchAll as fetchAllIntervalUnits} from '../services/intervalUnitService';
import {fetchAll as fetchAllRanks} from '../services/rankService';
import {fetchAll as fetchAllEmployeeDepartments} from '../services/employeeDepartmentService';
import Vessel from '../core/models/Vessel';
import vesselOwner from '../core/models/VesselOwner';
import VesselDepartment from '../core/models/VesselDepartment';
import MachineryModel from '../core/models/MachineryModel';
import MachineryMaker from '../core/models/MachineryMaker';
import Machinery from '../core/models/Machinery';
import MachinerySubCategoryDescription from '../core/models/MachinerySubCategoryDescription';
import Interval from '../core/models/Interval';
import IntervalUnit from '../core/models/IntervalUnit';
import Rank from '../core/models/InChargeRank';
import EmployeeDepartment from '../core/models/EmployeeDepartment';
import Transform from '../utils/Transformer';

const initialState = {
  vesselOwners: [],
  vesselDepartments: [],
  vessels: [],
  machineryModels: [],
  machineryMakers: [],
  machineries: [],
  machinerySubCategoryDescriptions: [],
  intervals: [],
  intervalUnits: [],
  ranks: [],
  employeeDepartments: []
};

export const vesselOwnersAsync = createAsyncThunk(
  'option/fetchAllVesselsOwner',
  async (params) => {
    const response = await fetchAllVesselOwners(params);
    return Transform.fetchCollection(response.data, vesselOwner);
  }
);

export const vesselDepartmentsAsync = createAsyncThunk(
  'option/fetchAllVesselDepartments',
  async (params) => {
    const response = await fetchAllVesselDepartments(params);
    return Transform.fetchCollection(response.data, VesselDepartment);
  }
);

export const vesselsAsync = createAsyncThunk(
  'option/fetchAllVessels',
  async (params) => {
    const response = await fetchAllVessels(params);
    return Transform.fetchCollection(response.data, Vessel);
  }
);

export const machineryModelsAsync = createAsyncThunk(
  'option/fetchAllMachineryModels',
  async (params) => {
    const response = await fetchAllMachineryModels(params);
    return Transform.fetchCollection(response.data, MachineryModel);
  }
);

export const machineryMakersAsync = createAsyncThunk(
  'option/fetchAllMachineryMakers',
  async (params) => {
    const response = await fetchAllMachineryMakers(params);
    return Transform.fetchCollection(response.data, MachineryMaker);
  }
);

export const machineriesAsync = createAsyncThunk(
  'option/fetchAllMachineries',
  async (params) => {
    const response = await fetchAllMachineries(params);
    return Transform.fetchCollection(response.data, Machinery);
  }
);

export const machinerySubCategoryDescriptionsAsync = createAsyncThunk(
  'option/fetchAllMachinerySubCategoryDescriptions',
  async (params) => {
    const response = await fetchAllMachinerySubCategoryDescriptions(params);
    return Transform.fetchCollection(response.data, MachinerySubCategoryDescription);
  }
);


export const intervalsAsync = createAsyncThunk(
  'option/fetchAllIntervals',
  async (params) => {
    const response = await fetchAllIntervals(params);
    return Transform.fetchCollection(response.data, Interval);
  }
);

export const intervalUnitsAsync = createAsyncThunk(
  'option/fetchAllIntervalUnits',
  async (params) => {
    const response = await fetchAllIntervalUnits(params);
    return Transform.fetchCollection(response.data, IntervalUnit);
  }
);

export const ranksAsync = createAsyncThunk(
  'option/fetchAllRanks',
  async (params) => {
    const response = await fetchAllRanks(params);
    return Transform.fetchCollection(response.data, Rank);
  }
);

export const employeeDepartmentsAsync = createAsyncThunk(
  'option/fetchAllEmployeeDepartments',
  async (params) => {
    const response = await fetchAllEmployeeDepartments(params);
    return Transform.fetchCollection(response.data, EmployeeDepartment);
  }
);

export const optionSlice = createSlice({
  name: 'option',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(vesselOwnersAsync.fulfilled, (state, action) => {
        state.vesselOwners = action.payload;
      })
      .addCase(vesselDepartmentsAsync.fulfilled, (state, action) => {
        state.vesselDepartments = action.payload;
      })
      .addCase(vesselsAsync.fulfilled, (state, action) => {
        state.vessels = action.payload;
      })
      .addCase(machineryModelsAsync.fulfilled, (state, action) => {
        state.machineryModels = action.payload;
      })
      .addCase(machineryMakersAsync.fulfilled, (state, action) => {
        state.machineryMakers = action.payload;
      })
      .addCase(machineriesAsync.fulfilled, (state, action) => {
        state.machineries = action.payload;
      })
      .addCase(machinerySubCategoryDescriptionsAsync.fulfilled, (state, action) => {
        state.machinerySubCategoryDescriptions = action.payload;
      })
      .addCase(intervalsAsync.fulfilled, (state, action) => {
        state.intervals = action.payload;
      })
      .addCase(intervalUnitsAsync.fulfilled, (state, action) => {
        state.intervalUnits = action.payload;
      })
      .addCase(ranksAsync.fulfilled, (state, action) => {
        state.ranks = action.payload;
      })
      .addCase(employeeDepartmentsAsync.fulfilled, (state, action) => {
        state.employeeDartments = action.payload;
      })
  },
});

export const vesselOwners = state => state.option.vesselOwners;
export const vesselDepartments = state => state.option.vesselDepartments;
export const vessels = state => state.option.vessels;
export const machineryModels = state => state.option.machineryModels;
export const machineryMakers = state => state.option.machineryMakers;
export const machineries = state => state.option.machineries;
export const machinerySubCategoryDescriptions = state => state.option.machinerySubCategoryDescriptions;
export const intervals = state => state.option.intervals;
export const intervalUnits = state => state.option.intervalUnits;
export const ranks = state => state.option.ranks;
export const employeeDepartments = state => state.option.employeeDepartments;

export default optionSlice.reducer;
