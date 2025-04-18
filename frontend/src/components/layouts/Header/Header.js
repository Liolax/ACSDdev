import React from 'react';
import { Link } from 'react-router-dom';
import './Header.module.scss';

const Header = () => {
  return (
    <header className="header">
      <h1>ÉireCraft</h1>
      <p>Artisan Market</p>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
