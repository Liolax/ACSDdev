import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ContactPage from './pages/ContactPage';
import './App.css'; // Main CSS for styling

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Define routes for each page */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Company Portfolio (Home) */}
          <Route path="/login" element={<Login />} /> {/* Login and Role Selection */}
          <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} /> {/* Buyer Dashboard */}
          <Route path="/seller-dashboard" element={<SellerDashboardPage />} /> {/* Seller Dashboard */}
          <Route path="/contact" element={<ContactPage />} /> {/* Contact Page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
