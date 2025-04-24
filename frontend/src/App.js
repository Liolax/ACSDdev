import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import MarketPage from './pages/MarketPage';
import ContactPage from './pages/ContactPage';
import './assets/styles/main.scss';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboardPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
