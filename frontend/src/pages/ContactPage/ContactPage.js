import React from 'react';
import Header from '../../components/layouts/Header/Header'; 
import Footer from '../../components/layouts/Footer/Footer'; 
import ContactForm from '../../components/forms/ContactForm/ContactForm'; 
import './ContactPage.module.scss'; // Assuming this is a SASS file

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Header />
      <div className="contact-page-content">
        <h2>Contact Us</h2>
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
