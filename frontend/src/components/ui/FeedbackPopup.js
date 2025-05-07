import React, { useState, useEffect, useRef } from 'react';

const FeedbackPopup = ({ orderId, userId, closePopup, onSubmitFeedback, initialFeedback = null }) => {
  const [rating, setRating] = useState(initialFeedback?.rating || 5);
  const [title, setTitle] = useState(initialFeedback?.title || '');
  const [comments, setComments] = useState(initialFeedback?.comments || '');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const titleRef = useRef(null);

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

  // Add validation effect
  useEffect(() => {
    if (title.trim() && comments.trim() && rating >= 1 && rating <= 5) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [title, comments, rating]);

  // Focus first invalid field on error
  useEffect(() => {
    if (error && titleRef.current) {
      titleRef.current.focus();
    }
  }, [error]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !comments.trim()) {
      setError('Title and comments are required.');
      setIsValid(false);
      return;
    }
    let order = orderId;
    let itemId = undefined;
    if (order && typeof order === 'object' && order.orderId && order.itemId) {
      itemId = order.itemId;
      order = order.orderId;
    }
    onSubmitFeedback({ orderId: order, itemId, rating, title, comments });
    setSubmitted(true);
  };

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" aria-label="Feedback form">
      <div className="popup">
        {submitted ? (
          <div className="popup__thankyou" role="status">Thank you for your feedback!</div>
        ) : (
          <form className="popup__form" onSubmit={handleSubmit} noValidate>
            <h3 className="popup__title">{initialFeedback ? 'Edit Feedback' : 'Provide Feedback'}</h3>
            <div className="popup__field">
              <label className="popup__label" id="rating-label">Rating:</label>
              <div className="popup__ratings" role="radiogroup" aria-labelledby="rating-label">
                {[1,2,3,4,5].map(num => (
                  <label key={num} className="popup__rating-label">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={rating === num}
                      onChange={() => setRating(num)}
                      aria-checked={rating === num}
                      aria-label={`${num} star${num > 1 ? 's' : ''}`}
                    />
                    <span>{'★'.repeat(num)}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="popup__label" htmlFor="feedback-title">Title:</label>
            <input
              type="text"
              id="feedback-title"
              placeholder="Title"
              className="popup__input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              minLength={2}
              aria-required="true"
              aria-invalid={!!error && !title.trim()}
              aria-describedby={error && !title.trim() ? "feedback-title-error" : undefined}
              ref={titleRef}
            />
            <label className="popup__label" htmlFor="feedback-comments">Comments:</label>
            <textarea
              id="feedback-comments"
              className="popup__textarea"
              placeholder="Your comments..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              required
              minLength={2}
              aria-required="true"
              aria-invalid={!!error && !comments.trim()}
              aria-describedby={error && !comments.trim() ? "feedback-comments-error" : undefined}
            />
            {error && <div className="popup__error" id="feedback-title-error" role="alert">{error}</div>}
            <div className="popup__actions">
              <button type="button" className="popup__button" onClick={closePopup}>Cancel</button>
              <button type="submit" className="popup__button popup__button--primary" disabled={!isValid} aria-disabled={!isValid}>Submit</button>
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