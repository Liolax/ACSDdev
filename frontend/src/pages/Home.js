import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import OurCommunity from '../components/OurCommunity';
import OurProducts from '../components/OurProducts';

const Home = () => {
  return (
    <div className="page-container home-page">
      <Header />
      <main className="home-page__main-content">
        <OurCommunity />
        <OurProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
