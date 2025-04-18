import React from 'react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import BuyerDashboard from '../../components/BuyerDashboard/BuyerDashboard';
import styles from './BuyerDashboardPage.module.scss';

const BuyerDashboardPage = () => {
  return (
    <div className={styles["dashboard-container"]}>
      <Header userRole="buyer" />
      <main>
        <BuyerDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerDashboardPage;
