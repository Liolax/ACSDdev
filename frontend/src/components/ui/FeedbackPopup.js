import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/_popup.scss';

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
    setTimeout(() => {
      closePopup();
    }, 2000);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        {submitted ? (
          <p className="popup__thankyou">Thank you for your feedback!</p>
        ) : (
          <>
            <h2 className="popup__title">
              {initialFeedback ? 'Edit Feedback' : 'Provide Feedback'}
            </h2>
            <form className="popup__form" onSubmit={handleSubmit}>
              <div className="popup__field" style={{ marginBottom: 10 }}>
                <label className="popup__label">Rating:</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <label
                      key={num}
                      className="popup__rating-label"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        borderRadius: 6,
                        padding: '2px 5px',
                        background: rating === num ? '#ecfdf3' : 'transparent',
                        transition: 'background 0.18s'
                      }}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={num}
                        checked={rating === num}
                        onChange={() => setRating(num)}
                        style={{
                          accentColor: "#1caf68",
                          width: 16,
                          height: 16,
                          marginRight: 2,
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        fontWeight: rating === num ? "bold" : "normal",
                        color: rating === num ? "#1caf68" : "#177e48"
                      }}>{num}</span>
                    </label>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="popup__input"
                required
              />
              <textarea
                placeholder="Your comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="popup__textarea"
                required
              ></textarea>
              <button type="submit" className="popup__button">
                Submit Feedback
              </button>
            </form>
          </>
        )}
        <button className="popup__close" onClick={closePopup} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
};

export default FeedbackPopup;