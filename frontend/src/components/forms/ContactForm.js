import React, { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../../assets/styles/components/_contact-form.scss';

const ContactForm = ({ onSuccess }) => {
  const [state, handleSubmit] = useForm("mjkydqyo");

  useEffect(() => {
    if (state.succeeded && onSuccess) {
      onSuccess();
    }
  }, [state.succeeded, onSuccess]);

  if (state.succeeded) {
    return <p className="contact-form__success">Thanks for contacting us!</p>;
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

        <button
          type="submit"
          disabled={state.submitting}
          className="contact-form__button"
        >
          Send Message
        </button>
        <p className="contact-form__privacy" aria-label="privacy">
          By clicking "Send Message", you agree to our Privacy Policy and the processing of your message.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;