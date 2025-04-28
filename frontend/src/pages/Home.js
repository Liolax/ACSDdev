import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUser({ role: storedRole });
    }
  }, []);

  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  return (
    <div className="page-container home-page">
      <Header onLoginClick={openLoginPopup} />
      <main className="home-page__main-content">
        <OurCommunity />
        <OurProducts
          user={user}
          openLoginPopup={openLoginPopup}
          // can pass onAddToCart/onAddToWishlist here if needed.
        />
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup
          onClose={closeLoginPopup}
          handleLogin={(email, password, rememberMe, role) => {
            handleLogin(navigate, email, password, rememberMe, role);
            setUser({ role });
            localStorage.setItem('userRole', role);
          }}
        />
      )}
    </div>
  );
};

export default Home;
