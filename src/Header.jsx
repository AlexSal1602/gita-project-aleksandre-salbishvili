import React from 'react';
import './Header.css';
import logo from '/New_Horizons_Logo-removebg-preview.png';

const Header = () => {
  return (
    <div id="header">
      <img 
        src={logo}
        alt="Logo" 
        className="header-logo" 
      />
      <h4>Project by Aleksandre Salbishvili</h4>
    </div>
  );
};

export default Header;