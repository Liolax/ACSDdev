import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import OurCommunity from '../components/OurCommunity';
import OurProducts from '../components/OurProducts';
import LoginPopup from '../components/LoginPopup';
import { handleLogin } from '../services/authUtils';

const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  // Read the user's role from localStorage.
  const userRole = localStorage.getItem('userRole') || null;

  const openLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className="page-container home-page">
      {/* Pass userRole to Header so logged-in buyers/sellers see their nav links */}
      <Header userRole={userRole} onLoginClick={openLoginPopup} />
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
