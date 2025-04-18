import React from 'react';
import Header from '../../components/layouts/Header/Header'; 
import Footer from '../../components/layouts/Footer/Footer'; 
import SellerDashboard from '../../components/SellerDashboard/SellerDashboard'; 
import './SellerDashboardPage.module.scss'; // Assuming this is a SASS file

const SellerDashboardPage = () => {
  return (
    <div className="seller-dashboard-page">
      <Header />
      <main>
        <SellerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
