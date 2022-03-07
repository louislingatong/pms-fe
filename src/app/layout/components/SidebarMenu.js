import React from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Sidebar} from 'adminlte-2-react';
import user from '../../../assets/images/user2-160x160.jpg';
import {profileData} from '../../store/profileSlice';
import {Item} from "../../components/";

function SidebarMenu() {
  const history = useHistory();
  const {UserPanel} = Sidebar;
  const profile = useSelector(profileData);

  const managementRoutes = [
    {
      name: 'Employees',
      path: '/employees'
    },
    {
      name: 'Vessels',
      path: '/vessels'
    },
    {
      name: 'Machinery',
      path: '/machinery'
    },
    {
      name: 'Vessel Machinery',
      path: '/vessel-machinery'
    },
    {
      name: 'Intervals',
      path: '/intervals'
    },
  ];

  const pmsRoutes = [
    {
      name: 'Running Hours',
      path: '/running-hours'
    },
    {
      name: 'Works',
      path: '/works'
    },
    {
      name: 'MECO Setting',
      path: '/meco-setting'
    },
    {
      name: 'Monitoring',
      path: '/monitoring'
    },
  ];


  return (
    <React.Fragment>
      <UserPanel imageUrl={user} username={profile.full_name} status="Online" statusType="success"/>
      <Item icon="fa-tachometer-alt" text="Dashboard" to="/" history={history}/>
      <Item text="Management" icon="fa-list">
        {managementRoutes.map((route) => <Item key={route.path} text={route.name} to={route.path}/>)}
      </Item>
      <Item text="PMS" icon="fa-wrench">
        {pmsRoutes.map((route) => <Item key={route.path} text={route.name} to={route.path}/>)}
      </Item>
    </React.Fragment>
  );
}

export default SidebarMenu;
