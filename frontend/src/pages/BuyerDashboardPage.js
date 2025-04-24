import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BuyerDashboard from '../components/pages/BuyerDashboard/BuyerDashboard';
import '../assets/styles/pages/_buyer-dashboard.scss';

const BuyerDashboardPage = () => {
  // Retrieve the user's role; default to "buyer" if not set.
  const userRole = localStorage.getItem('userRole') || 'buyer';

  return (
    <div className="page-container buyer-dashboard-page">
      <Header userRole={userRole} />
      <main className="buyer-dashboard-page__main">
        <BuyerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerDashboardPage;
