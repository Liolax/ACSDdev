import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import LoginPopup from '../components/LoginPopup';
import { handleLogin } from '../services/authUtils';
import '../assets/styles/pages/_pageContainer.scss';

const Login = () => {
  const navigate = useNavigate();

  // We provide a no-operation close function here, because when on the Login page
  // the login form/popup is always displayed.
  const noOpClose = () => {};

  return (
    <div className="page-container login-page">
      <Header userRole={null} onLoginClick={noOpClose} />
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
