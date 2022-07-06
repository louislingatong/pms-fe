import React from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Sidebar} from 'adminlte-2-react';
import user from '../../../assets/images/user2-160x160.jpg';
import {profileData} from '../../store/profileSlice';
import {Item} from '../../components/';

function SidebarMenu() {
  const history = useHistory();
  const {UserPanel} = Sidebar;
  const profile = useSelector(profileData);

  const managementRoutes = [
    {
      name: 'Employees',
      path: '/employees',
      permission: 'employee_access'
    },
    {
      name: 'Vessels',
      path: '/vessels',
      permission: 'vessel_access'
    },
    {
      name: 'New Machinery',
      path: '/machinery',
      permission: 'machinery_access'
    },
    {
      name: 'Vessel Add Machinery',
      path: '/vessel-machinery',
      permission: 'vessel_machinery_access'
    },
    {
      name: 'Intervals',
      path: '/intervals',
      permission: 'interval_access'
    },
  ];

  const pmsRoutes = [
    {
      name: 'Running Hours',
      path: '/running-hours',
      permission: 'running_hours_access'
    },
    {
      name: 'Update Jobs',
      path: '/works',
      permission: 'jobs_access'
    },
    {
      name: 'MECO Setting',
      path: '/meco-setting',
      permission: 'meco_setting_access'
    },
    {
      name: 'Monitoring',
      path: '/monitoring',
      permission: 'monitoring_access'
    },
  ];


  return (
    <React.Fragment>
      <UserPanel imageUrl={user} username={profile.full_name} status="Online" statusType="success"/>
      <Item id="dashboard" icon="fa-tachometer-alt" text="Dashboard" to="/" history={history}/>
      <Item id="management" text="Management" icon="fa-list">
        {
          managementRoutes.map((route) => (
            !!profile.permissions[route.permission]
            && <Item key={route.path} id={route.path} text={route.name} to={route.path}/>
          ))
        }
      </Item>
      <Item id="pms" text="PMS" icon="fa-wrench">
        {
          pmsRoutes.map((route) => (
            !!profile.permissions[route.permission]
            && <Item key={route.path} id={route.path} text={route.name} to={route.path}/>
          ))
        }
      </Item>
    </React.Fragment>
  );
}

export default SidebarMenu;
