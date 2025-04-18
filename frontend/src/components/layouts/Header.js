import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ userRole }) => (
  <header className="header">
    <div className="header__logo">ÉireCraft</div>
    <nav className="header__nav">
      {userRole === 'seller' ? (
        <>
          <Link to="/seller-dashboard">My Products</Link>
          <Link to="/add-product">Add Product</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/logout">Logout</Link>
        </>
      ) : userRole === 'buyer' ? (
        <>
          <Link to="/buyer-dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/logout">Logout</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/contact">Contact</Link>
        </>
      )}
    </nav>
  </header>
);

export default Header;
