import {lazy} from 'react'

const routes = [
  {
    name: 'Dashboard',
    path: '/',
    auth: true,
    component: lazy(() => import('../views/Dashboard')),
  },
  {
    name: 'Profile',
    path: '/profile',
    auth: true,
    component: lazy(() => import('../views/Profile')),
  },
  {
    name: 'Employees',
    path: '/employees',
    auth: true,
    component: lazy(() => import('../views/management/employee/EmployeeList')),
  },
  {
    name: 'Employee Details',
    path: '/employees/:id',
    auth: true,
    component: lazy(() => import('../views/management/employee/EmployeeView')),
  },
  {
    name: 'Vessels',
    path: '/vessels',
    auth: true,
    component: lazy(() => import('../views/management/vessel/VesselList')),
  },
  {
    name: 'Vessel Details',
    path: '/vessels/:id',
    auth: true,
    component: lazy(() => import('../views/management/vessel/VesselView')),
  },
  {
    name: 'Machinery',
    path: '/machinery',
    auth: true,
    component: lazy(() => import('../views/management/machinery/MachineryList')),
  },
  {
    name: 'Vessel Machinery',
    path: '/vessel-machinery',
    auth: true,
    component: lazy(() => import('../views/management/vessel-machinery/VesselMachineryList')),
  },
  {
    name: 'Intervals',
    path: '/intervals',
    auth: true,
    component: lazy(() => import('../views/management/interval/IntervalList')),
  },
  {
    name: 'Running Hours',
    path: '/running-hours',
    auth: true,
    component: lazy(() => import('../views/pms/running-hour/RunningHourList')),
  },
  {
    name: 'Works',
    path: '/works',
    auth: true,
    component: lazy(() => import('../views/pms/work/WorkList')),
  },
  {
    name: 'Login',
    path: '/login',
    component: lazy(() => import('../views/auth/login/Login')),
  },
  {
    name: 'Forgot Password',
    path: '/forgot-password',
    component: lazy(() => import('../views/auth/ForgotPassword')),
  },
  {
    path: '*',
    invalid: true,
  }
];

export default routes;
