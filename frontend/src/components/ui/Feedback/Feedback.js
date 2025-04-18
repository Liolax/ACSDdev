import React, { useState } from 'react';
import './Feedback.css'; // Create and adjust styles as needed

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Send the feedback data to our API
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return <p>Thank you for your feedback!</p>;
  }

  return (
    <div className="feedback">
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label htmlFor="feedback-name">Name:</label>
        <input
          type="text"
          id="feedback-name"
          name="name"
          value={feedback.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="feedback-email">Email:</label>
        <input
          type="email"
          id="feedback-email"
          name="email"
          value={feedback.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="feedback-message">Message:</label>
        <textarea
          id="feedback-message"
          name="message"
          value={feedback.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
