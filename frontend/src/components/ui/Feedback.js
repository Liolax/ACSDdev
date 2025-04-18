import React, { useState } from 'react';
import '../../../assets/styles/components/_feedback.scss';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send the feedback data to our API
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="feedback__message">Thank you for your feedback!</p>;
  }

  return (
    <div className="feedback">
      <h2 className="feedback__title">Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback__form">
        <label htmlFor="feedback-name" className="feedback__label">Name:</label>
        <input
          type="text"
          id="feedback-name"
          name="name"
          value={feedback.name}
          onChange={handleChange}
          className="feedback__input"
          required
        />

        <label htmlFor="feedback-email" className="feedback__label">Email:</label>
        <input
          type="email"
          id="feedback-email"
          name="email"
          value={feedback.email}
          onChange={handleChange}
          className="feedback__input"
          required
        />

        <label htmlFor="feedback-message" className="feedback__label">Message:</label>
        <textarea
          id="feedback-message"
          name="message"
          value={feedback.message}
          onChange={handleChange}
          className="feedback__textarea"
          required
        ></textarea>

        <button type="submit" className="feedback__button">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
