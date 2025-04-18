import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ userRole, onLoginClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session state here later
    // Then navigate to Home
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__logo">ÉireCraft</div>
      <nav className="header__nav">
        {userRole === 'seller' ? (
          <>
            <Link to="/seller-dashboard">My Products</Link>
            <Link to="/add-product">Add Product</Link>
            <Link to="/feedback">Feedback</Link>
            <button onClick={handleLogout} className="header__logout-btn">
              Logout
            </button>
          </>
        ) : userRole === 'buyer' ? (
          <>
            <Link to="/buyer-dashboard">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/contact">Contact</Link>
            <button onClick={handleLogout} className="header__logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            {onLoginClick ? (
              <button className="header__login-btn" onClick={onLoginClick}>
                Login
              </button>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <Link to="/contact">Contact</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
