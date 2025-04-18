import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import BuyerDashboardPage from './pages/BuyerDashboardPage/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage/SellerDashboardPage';
import ContactPage from './pages/ContactPage/ContactPage';
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
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
