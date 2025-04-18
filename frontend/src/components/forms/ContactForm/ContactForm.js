import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from './ContactForm.module.scss';

const ContactForm = () => {
  // Dummy state to ensure useState is loaded correctly
  // eslint-disable-next-line no-unused-vars
  const [dummy] = useState(null);
  
  const [state, handleSubmit] = useForm("mjkydqyo");

  if (state.succeeded) {
    return <p className={styles["contact-success"]}>Thanks for contacting us!</p>;
  }

  return (
    <form
      action="https://formspree.io/f/mjkydqyo"
      method="POST"
      onSubmit={handleSubmit}
      className={styles["contact-form"]}
    >
      <label htmlFor="name">Name:</label>
      <input id="name" type="text" name="name" required />
      <ValidationError prefix="Name" field="name" errors={state.errors} />

      <label htmlFor="email">Email:</label>
      <input id="email" type="email" name="email" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      <label htmlFor="message">Message:</label>
      <textarea id="message" name="message" required></textarea>
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <button type="submit" disabled={state.submitting}>
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
