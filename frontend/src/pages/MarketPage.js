import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import '../assets/styles/pages/_market.scss';

const MarketPage = () => {
  const userRole = localStorage.getItem('userRole');
  return (
    <div className="page-container market-page">
      <Header userRole={userRole} />
      <main className="market-page__main-content">
        <h2 className="market-page__title">Welcome to the Market</h2>
        <p className="market-page__description">
          Browse our available products and discover great deals!
        </p>
        <StandardProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default MarketPage;
