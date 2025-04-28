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
    // fetch the logged-in user's role here (e.g., from localStorage or an auth provider)
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
        {/* Pass the user object and the login popup handler to OurProducts */}
        <OurProducts user={user} openLoginPopup={openLoginPopup} />
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup 
          onClose={closeLoginPopup}
          handleLogin={(email, password, rememberMe, role) => {
            handleLogin(navigate, email, password, rememberMe, role);
            // Update the user state on successful login
            setUser({ role });
          }}
        />
      )}
    </div>
  );
};

export default Home;
