import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import LoginPopup from '../components/LoginPopup';
import { handleLogin } from '../services/authUtils'; 
import '../assets/styles/pages/_pageContainer.scss';

const Login = () => {
  const navigate = useNavigate();
  const noOpClose = () => {};

  return (
    <div className="page-container login-page">
      <Header onLoginClick={noOpClose} userRole={null} />
      <main className="login-page__main-content">
        <LoginPopup 
          onClose={noOpClose} 
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

