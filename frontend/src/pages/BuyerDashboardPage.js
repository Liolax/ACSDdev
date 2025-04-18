import React from 'react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import BuyerDashboard from '../../pages/BuyerDashboard';

const BuyerDashboardPage = () => {
  return (
    <div className="page-container buyer-dashboard-page">
      <Header userRole="buyer" />
      <main>
        <BuyerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerDashboardPage;
