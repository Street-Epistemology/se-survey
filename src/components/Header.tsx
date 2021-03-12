import React from 'react';
import logo from '../images/se-logo-color.png';
import { Link } from 'react-router-dom';

export const Header = ({ title }: { title: string }) => {
  return (
    <div className="row align-items-center">
      <div className="col-md-auto text-center">
        <Link className="col-sm" to="/">
          <img src={logo} className="logo m-4" alt="logo" />
        </Link>
      </div>
      <div className="col align-middle text-center">
        <h3 className="col-sm text-uppercase w-100">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default Header;
