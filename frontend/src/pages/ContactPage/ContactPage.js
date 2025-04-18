import React from 'react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import ContactForm from '../../components/forms/ContactForm/ContactForm';
import styles from './ContactPage.module.scss';

const ContactPage = () => {
  return (
    <div className={styles.contactPage}>
      <Header />
      <div className={styles.contactPage__content}>
        <h2>Contact Us</h2>
        <p className={styles.contactPage__description}>
          Please fill out the form below to share your feedback or inquiries.
          We value your input and will respond as soon as possible.
        </p>
        <ContactForm />
        <p className={styles.contactPage__privacy}>
          By clicking “Send Message”, you consent to our Privacy Policy and agree
          that your message will be processed accordingly.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
