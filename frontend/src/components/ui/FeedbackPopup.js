import React, { useState, useEffect } from 'react';

const FeedbackPopup = ({ orderId, userId, closePopup, onSubmitFeedback, initialFeedback = null }) => {
  const [rating, setRating] = useState(initialFeedback?.rating || 5);
  const [title, setTitle] = useState(initialFeedback?.title || '');
  const [comments, setComments] = useState(initialFeedback?.comments || '');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

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
    setError(null);
    setSubmitted(false);
  }, [initialFeedback, orderId]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !comments.trim()) {
      setError('Title and comments are required.');
      setIsValid(false);
      return;
    }
    onSubmitFeedback({ order: orderId, user: userId, rating, title, comments });
    setSubmitted(true);
    setIsValid(true);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        {submitted ? (
          <div className="popup__thankyou">Thank you for your feedback!</div>
        ) : (
          <form className="popup__form" onSubmit={handleSubmit}>
            <h3 className="popup__title">{initialFeedback ? 'Edit Feedback' : 'Provide Feedback'}</h3>
            <div className="popup__field">
              <label className="popup__label">Rating:</label>
              <div className="popup__ratings">
                {[1,2,3,4,5].map(num => (
                  <label key={num} className="popup__rating-label">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={rating === num}
                      onChange={() => setRating(num)}
                    />
                    <span>{'★'.repeat(num)}</span>
                  </label>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Title"
              className="popup__input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              className="popup__textarea"
              placeholder="Your comments..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              required
            />
            {error && <div className="popup__error">{error}</div>}
            <div className="popup__actions">
              <button type="button" className="popup__button" onClick={closePopup}>Cancel</button>
              <button type="submit" className="popup__button popup__button--primary" disabled={!isValid}>Submit</button>
            </div>
          </form>
        )}
        {!submitted && (
          <button className="popup__close" onClick={closePopup} aria-label="Close">
            ×
          </button>
        )}
      </div>
    </div>
  );
};
export default FeedbackPopup;