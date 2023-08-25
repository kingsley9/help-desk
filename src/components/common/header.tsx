import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
          H<span style={{ color: '#008CBA' }}>D</span>
        </Link>
      </div>
      <div className="menu">
        <Link to="/" className="menu-item">
          Home
        </Link>
        <Link to="/about" className="menu-item">
          About
        </Link>
        <Link to="/privacy/cookie" className="menu-item">
          Privacy
        </Link>
        <Link to="/admin/login" className="menu-item">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Header;
