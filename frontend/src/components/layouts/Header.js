import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import '../../assets/styles/components/_header.scss';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const Header = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // userRole is always derived from AuthContext's user object
  const userRole = user ? user.role : null;
  const ROLES_SAFE = ROLES || { BUYER: 'buyer', SELLER: 'seller' };
  const logoLink = userRole === ROLES_SAFE.SELLER ? '/seller-dashboard' : '/';

  const handleLogout = () => {
    authLogout();
    navigate('/');
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to={logoLink} onClick={handleLinkClick}>
          <img src={logo} alt="ÉireCraft Logo" className="header__logo-image" />
          <div className="header__logo-text">
            <span className="header__logo-main">ÉireCraft</span>
            <span className="header__logo-slogan">Artisan Market</span>
          </div>
        </NavLink>
      </div>
      <button
        className="header__mobile-toggle"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        &#9776;
      </button>
      <nav className={`header__nav${menuOpen ? ' open' : ''}`} id="main-navigation">
        {userRole === ROLES_SAFE.SELLER ? (
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
        ) : userRole === ROLES_SAFE.BUYER ? (
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
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 9,
          }}
          onClick={toggleMenu}
          aria-label="Close navigation overlay"
        />
      )}
    </header>
  );
};

export default Header;
