import React from 'react';
import AdminLTE, {Footer, Navbar, Sidebar} from 'adminlte-2-react';
import NavbarMenu from './components/NavbarMenu';
import SidebarMenu from './components/SidebarMenu';
// import Dashboard from '../views/Dashboard';
// import EmployeeList from '../views/management/EmployeeList';
// import MachineryList from '../views/management/machinery/MachineryList';
// import IntervalList from '../views/management/interval/IntervalList';
// import VesselList from '../views/management/VesselList';
// import VesselMachineryList from '../views/management/vessel-machinery/VesselMachineryList';
// import RunningHourList from '../views/pms/RunningHourList';
// import WorkList from '../views/pms/WorkList';

function PrivateLayout({children}) {
  return (
    <AdminLTE title={['ASTRO', 'PMS']}
              titleShort={['A', 'PMS']}
              theme="black"
              footer={<Footer/>}
    >
      <Navbar.Core>
        <NavbarMenu/>
      </Navbar.Core>
      <Sidebar.Core>
        <SidebarMenu/>
      </Sidebar.Core>
      {children}
      {/*<Dashboard path="/" exact name="Dashboard"/>*/}
      {/*<EmployeeList path="/users" exact name="Users"/>*/}
      {/*<VesselList path="/vessels" exact name="Vessels"/>*/}
      {/*<MachineryList path="/machinery" exact name="Machinery"/>*/}
      {/*<VesselMachineryList path="/vessel-machinery" exact name="Vessel Machinery"/>*/}
      {/*<IntervalList path="/intervals" exact name="Intervals"/>*/}
      {/*<RunningHourList path="/running-hours" exact name="Running Hours"/>*/}
      {/*<WorkList path="/works" exact name="Works"/>*/}
    </AdminLTE>
  );
}

export default PrivateLayout;
