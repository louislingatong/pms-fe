import {lazy} from 'react'

const routes = [
  {
    name: 'Dashboard',
    path: '/',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/Dashboard')),
  },
  {
    name: 'Profile',
    path: '/profile',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/Profile')),
  },
  {
    name: 'Employees',
    path: '/employees',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/employee/EmployeeList')),
  },
  {
    name: 'Employee Details',
    path: '/employees/:id',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/employee/EmployeeView')),
  },
  {
    name: 'Vessels',
    path: '/vessels',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/vessel/VesselList')),
  },
  {
    name: 'Vessel Details',
    path: '/vessels/:id',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/vessel/VesselView')),
  },
  {
    name: 'Machinery',
    path: '/machinery',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/machinery/MachineryList')),
  },
  {
    name: 'Vessel Machinery',
    path: '/vessel-machinery',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/vessel-machinery/VesselMachineryList')),
  },
  {
    name: 'Intervals',
    path: '/intervals',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/management/interval/IntervalList')),
  },
  {
    name: 'Running Hours',
    path: '/running-hours',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/pms/running-hour/RunningHourList')),
  },
  {
    name: 'Works',
    path: '/works',
    exact: true,
    auth: true,
    component: lazy(() => import('../views/pms/work/WorkList')),
  },
  {
    name: 'Login',
    path: '/login',
    exact: true,
    component: lazy(() => import('../views/auth/login/Login')),
  },
  {
    name: 'Forgot Password',
    path: '/password/forgot',
    exact: true,
    component: lazy(() => import('../views/auth/forgot-password/ForgotPassword')),
  },
  {
    name: 'Reset Password',
    path: '/password/reset',
    exact: true,
    component: lazy(() => import('../views/auth/reset-password/ResetPassword')),
  },
  {
    path: '*',
    invalid: true,
  }
];

export default routes;
