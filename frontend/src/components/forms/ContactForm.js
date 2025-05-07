import React, { useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../../assets/styles/components/_contact-form.scss';

const ContactForm = ({ onSuccess }) => {
  const [state, handleSubmit] = useForm("mjkydqyo");
  const nameRef = useRef(null);

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
    if (!form.name.value.trim()) {
      e.preventDefault();
      form.name.focus();
      return false;
    }
    if (!form.email.value.trim() || !/\S+@\S+\.\S+/.test(form.email.value)) {
      e.preventDefault();
      form.email.focus();
      return false;
    }
    if (!form.message.value.trim()) {
      e.preventDefault();
      form.message.focus();
      return false;
    }
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