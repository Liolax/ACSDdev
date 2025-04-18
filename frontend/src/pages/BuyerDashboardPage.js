import React from 'react';
import Header from '../components/layouts/Header/Header';
import Footer from '../components/layouts/Footer/Footer';
import BuyerDashboard from '../components/BuyerDashboard/BuyerDashboard'; 

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
