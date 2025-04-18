import React from 'react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import SellerDashboard from '../../components/SellerDashboard/SellerDashboard';
import './SellerDashboardPage.module.scss';

const SellerDashboardPage = () => {
  return (
    <div className="seller-dashboard-page">
      <Header userRole="seller" />
      <main>
        <SellerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
