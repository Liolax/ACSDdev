import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './ContactForm.css';

const ContactForm = () => {
  const [state, handleSubmit] = useForm("mjkydqyo");

  // After a successful submission only this success message is shown.
  if (state.succeeded) {
    return <p className="contact-success">Thanks for contacting us!</p>;
  }

  return (
    <form
      action="https://formspree.io/f/mjkydqyo"
      method="POST"
      onSubmit={handleSubmit}
      className="contact-form"
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

