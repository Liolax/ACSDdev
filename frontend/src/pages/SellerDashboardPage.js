import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SellerDashboard from '../components/pages/SellerDashboard/SellerDashboard.js'; // or '../components/pages/SellerDashboard' if that's your file
import '../assets/styles/pages/_seller-dashboard.scss';

const SellerDashboardPage = () => {
  return (
    <div className="page-container seller-dashboard-page">
      <Header />
      <main className="seller-dashboard-page__main">
        <SellerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
