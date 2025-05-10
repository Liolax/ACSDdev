import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import ContactForm from '../components/forms/ContactForm';
import LoginPopup from '../components/LoginPopup';
import '../assets/styles/pages/_contact.scss';
import '../assets/styles/components/_contact-form.scss';

const ContactPage = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => setShowLoginPopup(true);
  const handleCloseLoginPopup = () => setShowLoginPopup(false);

  // Handler for login that closes popup after login
  const handleLogin = async (email, password, rememberMe, role) => {
    // Remove navigation here to allow user to submit the contact form
    setShowLoginPopup(false); // Ensure popup closes after login
  };

  const handleFormSuccess = () => setFormSubmitted(true);

  const userRole = localStorage.getItem('userRole');

  return (
    <div className="page-container contact-page-bg">
      <Header userRole={userRole} onLoginClick={handleLoginClick} />
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
        </section>
      </main>
      <Footer />
      {showLoginPopup && (
        <LoginPopup onClose={handleCloseLoginPopup} handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default ContactPage;