import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  return (
    <div className="page-container home-page">
      <Header onLoginClick={openLoginPopup} />
      <main className="home-page__main-content">
        <OurCommunity />
        <OurProducts openLoginPopup={openLoginPopup} />
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup 
          closePopup={closeLoginPopup}
          handleLogin={(email, password, rememberMe, role) =>
            handleLogin(navigate, email, password, rememberMe, role)
          }
        />
      )}
    </div>
  );
};

export default Home;
