import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import LoginPopup from '../components/LoginPopup';
import { handleLogin } from '../services/authUtils';

const Login = () => {
  const navigate = useNavigate();

  // A no-operation close function (provided for consistency)
  const noOpClose = () => {};

  return (
    <div className="page-container login-page">
      <Header userRole={null} />
      <main className="login-page__main-content">
        <LoginPopup 
          closePopup={noOpClose} 
          handleLogin={(email, password, rememberMe, role) =>
            handleLogin(navigate, email, password, rememberMe, role)
          } 
        />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
