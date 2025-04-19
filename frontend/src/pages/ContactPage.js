import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import ContactForm from '../components/forms/ContactForm';
import LoginPopup from '../components/LoginPopup';

const ContactPage = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const openLoginPopup = () => {
    setShowLoginPopup(true);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleLogin = (email, password, rememberMe, role) => {
    // Here we can implement our actual login logic
    console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);
    if (role === 'buyer') {
      navigate('/buyer-dashboard');
    } else {
      navigate('/seller-dashboard');
    }
  };

  return (
    <div className="page-container contact-page">
      {/* Pass onLoginClick prop so Header can trigger the login popup */}
      <Header onLoginClick={openLoginPopup} />
      <div className="contact-page__content">
        <h2>Contact Us</h2>
        <p className="contact-page__description">
          Please fill out the form below to share your feedback or inquiries.
          We value your input and will respond as soon as possible.
        </p>
        <ContactForm />
        <p className="contact-page__privacy">
          By clicking “Send Message”, you consent to our Privacy Policy and agree
          that your message will be processed accordingly.
        </p>
      </div>
      <Footer />
      {showLoginPopup && (
        <LoginPopup closePopup={closeLoginPopup} handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default ContactPage;
