import React, { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const ContactForm = ({ onSuccess }) => {
  const [state, handleSubmit] = useForm("mjkydqyo");
  
  // When form submission succeeds, notify the parent
  useEffect(() => {
    if (state.succeeded && onSuccess) {
      onSuccess();
    }
  }, [state.succeeded, onSuccess]);

  // If succeeded, render only the success message
  if (state.succeeded) {
    return <p className="contact-success">Thanks for contacting us!</p>;
  }

  return (
    <div className="contact-form-wrapper">
      <form
        action="https://formspree.io/f/mjkydqyo"
        method="POST"
        onSubmit={handleSubmit}
        className="contact-form"
      >
        <label htmlFor="name" className="contact-form__label">Name:</label>
        <input id="name" type="text" name="name" className="contact-form__input" required />
        <ValidationError prefix="Name" field="name" errors={state.errors} />

        <label htmlFor="email" className="contact-form__label">Email:</label>
        <input id="email" type="email" name="email" className="contact-form__input" required />
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="message" className="contact-form__label">Message:</label>
        <textarea id="message" name="message" className="contact-form__textarea" required></textarea>
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        {/* Use both classes for consistent Irish styling */}
        <button
          type="submit"
          disabled={state.submitting}
          className="button contact-form__button"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;