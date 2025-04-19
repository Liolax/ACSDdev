import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import SellerDashboard from '../components/pages/SellerDashboard';
import '../assets/styles/pages/_seller-dashboard.scss';

const SellerDashboardPage = () => {
  const userRole = localStorage.getItem('userRole');
  return (
    <div className="page-container seller-dashboard-page">
      <Header userRole={userRole} />
      <main>
        <SellerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
