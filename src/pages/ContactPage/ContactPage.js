import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Header />
      <div className="contact-page-content">
        <h2>Contact Us</h2>
        {/* These texts are hidden via CSS */}
        <p className="contact-description">
          Please fill out the form below to share your feedback or inquiries.
          We value your input and will respond as soon as possible.
        </p>
        <ContactForm />
        <p className="privacy-notice">
          By clicking “Send Message”, you consent to our Privacy Policy and agree
          that your message will be processed accordingly.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
