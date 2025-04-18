import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import OurCommunity from '../components/OurCommunity';
import OurProducts from '../components/OurProducts';
import LoginPopup from '../components/LoginPopup';

const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const openLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLogin = (email, password, rememberMe, role) => {
    // Validate credentials, call an API, etc.
    console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);
    if (role === 'buyer') {
      navigate('/buyer-dashboard');
    } else {
      navigate('/seller-dashboard');
    }
  };

  return (
    <div className="page-container home-page">
      {/* Pass onLoginClick so Header can trigger the login modal (e.g., when clicking "Login") */}
      <Header onLoginClick={openLoginPopup} />
      <main className="home-page__main-content">
        <OurCommunity />
        <OurProducts openLoginPopup={openLoginPopup} />
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup closePopup={closeLoginPopup} handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default Home;
