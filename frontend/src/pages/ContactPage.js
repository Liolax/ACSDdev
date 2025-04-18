import React from 'react';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
import ContactForm from '../../components/forms/ContactForm';

const ContactPage = () => {
  return (
    <div className="page-container contact-page">
      <Header />
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
    </div>
  );
};

export default ContactPage;
