import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import LoginPopup from '../components/LoginPopup';

const Login = () => {
  const handleLogin = (email, password, rememberMe, role) => {
    // Login logic for page-based login
    console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);
  };

  // In a page context, we might not need a close button—here we pass a no-op.
  const noOpClose = () => {};

  return (
    <div className="page-container login-page">
      <Header />
      <main className="login-page__main-content">
        <LoginPopup closePopup={noOpClose} handleLogin={handleLogin} />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
