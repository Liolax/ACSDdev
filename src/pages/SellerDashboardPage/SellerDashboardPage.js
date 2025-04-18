import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SellerDashboard from '../components/SellerDashboard';
import './SellerDashboardPage.css';

const SellerDashboardPage = () => {
  return (
    <div className="seller-dashboard-page">
      <Header /> {/* Reuse Header Component */}
      <main>
        <SellerDashboard /> {/* Main Seller Dashboard Logic */}
      </main>
      <Footer /> {/* Reuse Footer Component */}
    </div>
  );
};

export default SellerDashboardPage;
