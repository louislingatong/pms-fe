import React from 'react';
import AdminLTE, {Footer, Navbar, Sidebar} from 'adminlte-2-react';
import NavbarMenu from './components/NavbarMenu';
import SidebarMenu from './components/SidebarMenu';

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
    </AdminLTE>
  );
}

export default PrivateLayout;
