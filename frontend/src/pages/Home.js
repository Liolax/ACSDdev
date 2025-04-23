import React, { useState } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import OurCommunity from '../components/OurCommunity';
import OurProducts from '../components/OurProducts';
import LoginPopup from '../components/LoginPopup';
import { handleLogin } from '../services/authUtils';
import '../assets/styles/pages/_home.scss';
import '../assets/styles/pages/_pageContainer.scss';

const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  return (
    <div className="page-container home-page">
      {/* Wrap Header inside a full-width header-bg */}
      <div className="header-bg">
        <Header />
      </div>
      <main className="home-page__main-content">
        <OurCommunity />
        {/* Optionally wrap the product grid if you need extra centering */}
        <div className="product-grid-wrapper">
          <OurProducts openLoginPopup={openLoginPopup} />
        </div>
      </main>
      {/* Wrap Footer inside a full-width footer-bg */}
      <div className="footer-bg">
        <Footer />
      </div>
      {showLoginPopup && (
        <LoginPopup 
          closePopup={closeLoginPopup} 
          handleLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default Home;
