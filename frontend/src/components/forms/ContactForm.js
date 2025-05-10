import React, { useEffect, useRef, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../../assets/styles/components/_contact-form.scss';

const ContactForm = ({ onSuccess }) => {
  const [state, handleSubmit] = useForm("mjkydqyo");
  const nameRef = useRef(null);
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (state.succeeded && onSuccess) {
      onSuccess();
    }
  }, [state.succeeded, onSuccess]);

  // Focus first invalid field on error
  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      const errorField = state.errors[0].field;
      if (errorField === "name" && nameRef.current) nameRef.current.focus();
      // ...add refs for other fields if needed
    }
  }, [state.errors]);

  if (state.succeeded) {
    return <p className="contact-form__success" role="status">Thanks for contacting us!</p>;
  }

  // Simple client-side validation for accessibility
  const validate = (e) => {
    const form = e.target;
    const errors = {};
    if (!form.name.value.trim() || form.name.value.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!form.email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.message.value.trim() || form.message.value.trim().length < 5) {
      errors.message = "Message must be at least 5 characters.";
    }
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      // Focus first invalid field
      if (errors.name && nameRef.current) nameRef.current.focus();
      else if (errors.email) form.email.focus();
      else if (errors.message) form.message.focus();
      return false;
    }
    setClientErrors({});
    return true;
  };

  return (
    <div className="contact-form-wrapper">
      <form
        action="https://formspree.io/f/mjkydqyo"
        method="POST"
        onSubmit={e => { if (validate(e)) handleSubmit(e); }}
        className="contact-form"
        aria-label="Contact form"
        noValidate
      >
        <label htmlFor="name" className="contact-form__label">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          className="contact-form__input"
          required
          minLength={2}
          aria-required="true"
          aria-label="Name"
          ref={nameRef}
        />
        {clientErrors.name && <span className="form-error">{clientErrors.name}</span>}
        <ValidationError prefix="Name" field="name" errors={state.errors} />

        <label htmlFor="email" className="contact-form__label">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          className="contact-form__input"
          required
          aria-required="true"
          aria-label="Email"
          autoComplete="email"
        />
        {clientErrors.email && <span className="form-error">{clientErrors.email}</span>}
        <ValidationError prefix="Email" field="email" errors={state.errors} />

        <label htmlFor="message" className="contact-form__label">Message:</label>
        <textarea
          id="message"
          name="message"
          className="contact-form__textarea"
          required
          minLength={5}
          aria-required="true"
          aria-label="Message"
        ></textarea>
        {clientErrors.message && <span className="form-error">{clientErrors.message}</span>}
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        <button
          type="submit"
          disabled={state.submitting}
          className="contact-form__button"
          aria-disabled={state.submitting}
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