import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import ContactForm from '../components/forms/ContactForm';
import LoginPopup from '../components/LoginPopup';
import '../assets/styles/pages/_contact.scss';

const ContactPage = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const openLoginPopup = () => setShowLoginPopup(true);
  const closeLoginPopup = () => setShowLoginPopup(false);

  const handleLogin = (email, password, rememberMe, role) => {
    if (role === 'buyer') {
      navigate('/buyer-dashboard');
    } else {
      navigate('/seller-dashboard');
    }
  };

  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  const userRole = localStorage.getItem('userRole');

  return (
    <div className="page-container contact-page-bg">
      <Header userRole={userRole} onLoginClick={openLoginPopup} />
      <main className="contact-page__main">
        <section className="contact-page__content">
          {!formSubmitted && (
            <>
              <h2 className="contact-page__title">Contact Us</h2>
              <p className="contact-page__description">
                Share your feedback or inquiries below. We value your input and will respond promptly.
              </p>
            </>
          )}
          <ContactForm onSuccess={handleFormSuccess} />
          {!formSubmitted && (
            <p className="contact-page__privacy">
              By clicking "Send Message", you agree to our Privacy Policy and the processing of your message.
            </p>
          )}
        </section>
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup closePopup={closeLoginPopup} handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default ContactPage;