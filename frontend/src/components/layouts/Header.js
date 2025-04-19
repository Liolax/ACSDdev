import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = ({ userRole, onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (clear tokens, etc.) then navigate to Home
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  // Close menu when a nav link gets clicked (especially on mobile)
  const handleLinkClick = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to="/" onClick={handleLinkClick}>ÉireCraft</NavLink>
      </div>
      {/* Show mobile-toggle only when menu is closed */}
      {!menuOpen && (
        <div className="header__mobile-toggle" onClick={toggleMenu}>
          <span className="header__mobile-icon">&#9776;</span>
        </div>
      )}
      <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
        {userRole === 'seller' ? (
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
            <button className="header__nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : userRole === 'buyer' ? (
          <>
            <NavLink to="/buyer-dashboard" className="header__link" onClick={handleLinkClick}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className="header__link" onClick={handleLinkClick}>
              Products
            </NavLink>
            <NavLink to="/wishlist" className="header__link" onClick={handleLinkClick}>
              Wishlist
            </NavLink>
            <NavLink to="/cart" className="header__link" onClick={handleLinkClick}>
              Cart
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
                onClick={() => { onLoginClick(); handleLinkClick(); }}>
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
  );
};

export default Header;
