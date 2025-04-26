import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
// Importing the logo from assets so that Webpack processes and bundles it.
import logo from '../../assets/images/logo.svg';
import '../../assets/styles/components/_header.scss';

const Header = ({ userRole, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  let logoLink = "/";
  if (userRole === ROLES.SELLER) logoLink = "/seller-dashboard";
  else if (userRole === ROLES.BUYER) logoLink = "/buyer-dashboard";

  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to={logoLink} onClick={handleLinkClick}>
          <img
            src={logo}
            alt="ÉireCraft Logo"
            className="header__logo-image"
          />
          <div className="header__logo-text">
            <span className="header__logo-main">ÉireCraft</span>
            <span className="header__logo-slogan">Artisan Market</span>
          </div>
        </NavLink>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="header__mobile-toggle"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        tabIndex={0}
      >
        &#9776;
      </button>
      {/* Desktop/Mobile Navigation */}
      <nav className={`header__nav${menuOpen ? ' open' : ''}`} id="main-navigation">
        {userRole === ROLES.SELLER ? (
          <>
            <NavLink to="/seller-dashboard" className="header__link" onClick={handleLinkClick}>
              My Products
            </NavLink>
            <NavLink to="/contact" className="header__link" onClick={handleLinkClick}>
              Contact
            </NavLink>
            <button className="header__nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : userRole === ROLES.BUYER ? (
          <>
            <NavLink to="/buyer-dashboard" className="header__link" onClick={handleLinkClick}>
              My Purchases
            </NavLink>
            <NavLink to="/market" className="header__link" onClick={handleLinkClick}>
              Market
            </NavLink>
            <NavLink to="/contact" className="header__link" onClick={handleLinkClick}>
              Contact
            </NavLink>
            <button className="header__nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" end className="header__link" onClick={handleLinkClick}>
              Home
            </NavLink>
            {onLoginClick ? (
              <button
                className="header__nav-btn"
                onClick={() => {
                  onLoginClick();
                  handleLinkClick();
                }}
              >
                Login
              </button>
            ) : (
              <NavLink to="/login" className="header__link" onClick={handleLinkClick}>
                Login
              </NavLink>
            )}
            <NavLink to="/contact" className="header__link" onClick={handleLinkClick}>
              Contact
            </NavLink>
          </>
        )}
      </nav>
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 9
          }}
          onClick={toggleMenu}
          aria-label="Close navigation overlay"
        />
      )}
    </header>
  );
};

export default Header;
