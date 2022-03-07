import React from 'react';
import logo from '../../assets/images/logo.png';
import {Link} from 'react-router-dom';

function PublicLayout({children}) {
  return (
    <div className="login-box">
      <div className="login-logo">
        <Link to="/"><img height={150} src={logo} alt="Responsive image"/></Link>
      </div>
      {children}
    </div>
  );
}

export default PublicLayout;
