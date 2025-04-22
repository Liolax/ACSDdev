import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/_feedback-popup.scss';

const FeedbackPopup = ({ orderId, initialFeedback, closePopup, onSubmitFeedback }) => {
  const [rating, setRating] = useState(initialFeedback ? initialFeedback.rating : 5);
  const [title, setTitle] = useState(initialFeedback ? initialFeedback.title : '');
  const [comments, setComments] = useState(initialFeedback ? initialFeedback.comments : '');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialFeedback) {
      setRating(initialFeedback.rating);
      setTitle(initialFeedback.title);
      setComments(initialFeedback.comments);
    } else {
      setRating(5);
      setTitle('');
      setComments('');
    }
    setSubmitted(false);
  }, [initialFeedback]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = { orderId, rating, title, comments };
    onSubmitFeedback(feedbackData);
    setSubmitted(true);
    // Auto-close after 2 seconds
    setTimeout(() => {
      closePopup();
    }, 2000);
  };

  return (
    <div className="feedback-popup-overlay">
      <div className="feedback-popup">
        {submitted ? (
          <p className="feedback-popup__thankyou">Thank you for your feedback!</p>
        ) : (
          <>
            <h2 className="feedback-popup__title">
              {initialFeedback ? 'Edit Feedback' : 'Provide Feedback'}
            </h2>
            <form className="feedback-popup__form" onSubmit={handleSubmit}>
              <div className="feedback-popup__rating">
                <span>Rating:</span>
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} className="feedback-popup__rating-label">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={rating === num}
                      onChange={() => setRating(num)}
                    />
                    {num}
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="feedback-popup__input"
                required
              />
              <textarea
                placeholder="Your comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="feedback-popup__textarea"
                required
              ></textarea>
              <button type="submit" className="feedback-popup__button">
                Submit Feedback
              </button>
            </form>
          </>
        )}
        <button className="feedback-popup__close" onClick={closePopup}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default FeedbackPopup;
