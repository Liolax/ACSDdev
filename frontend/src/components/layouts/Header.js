import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import logo from '../../assets/images/logo.svg';

const Header = ({ userRole, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  let logoLink = "/";
  if (userRole === ROLES.SELLER) {
    logoLink = "/seller-dashboard";
  } else if (userRole === ROLES.BUYER) {
    logoLink = "/buyer-dashboard";
  }

  return (
    <div className="header-bg">
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
        {!menuOpen && (
          <div className="header__mobile-toggle" onClick={toggleMenu}>
            <span className="header__mobile-icon">&#9776;</span>
          </div>
        )}
        <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
          {userRole === ROLES.SELLER ? (
            <>
              <NavLink to="/seller-dashboard" className="header__link" onClick={handleLinkClick}>
                My Products
              </NavLink>
              <NavLink to="/add-product" className="header__link" onClick={handleLinkClick}>
                Add Product
              </NavLink>
              <NavLink to="/feedback" className="header__link" onClick={handleLinkClick}>
                Feedback
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
      </header>
    </div>
  );
};

export default Header;
