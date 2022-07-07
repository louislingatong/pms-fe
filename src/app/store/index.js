import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import navbarMenuReducer from './navbarMenuSlice';
import employeeReducer from './employeeSlice';
import vesselReducer from './vesselSlice';
import machineryReducer from './machinerySlice';
import intervalReducer from './intervalSlice';
import vesselMachineryReducer from './vesselMachinerySlice';
import runningHourReducer from './runningHourSlice';
import workReducer from './workSlice';
import optionReducer from './optionSlice';
import permissionReducer from './permissionSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    navbarMenu: navbarMenuReducer,
    employee: employeeReducer,
    vessel: vesselReducer,
    machinery: machineryReducer,
    interval: intervalReducer,
    vesselMachinery: vesselMachineryReducer,
    runningHour: runningHourReducer,
    work: workReducer,
    option: optionReducer,
    permission: permissionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload'],
        // Ignore these paths in the state
        ignoredPaths: [
          'navbarMenu',
          'profile',
          'employee',
          'vessel',
          'machinery',
          'vesselMachinery',
          'interval',
          'runningHour',
          'work',
          'option',
          'permission'
        ],
      },
    }),
});