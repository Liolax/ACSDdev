import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SellerDashboard from '../components/pages/SellerDashboard';

const SellerDashboardPage = () => {
  return (
    <div className="page-container seller-dashboard-page">
      <Header userRole="seller" />
      <main>
        <SellerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
