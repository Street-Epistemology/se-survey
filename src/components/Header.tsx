import React from 'react';
import logo from '../images/se-logo-color.png';

export const Header = () => {
  return (
    <div className="row align-items-center">
      <div className="col-md-auto text-center">
        <img src={logo} className="logo m-4 col-sm" alt="logo" />
      </div>
      <div className="col align-middle text-center">
        <h3 className="col-sm text-uppercase w-100">
          How do we know what we know?
        </h3>
      </div>
    </div>
  );
};

export default Header;
