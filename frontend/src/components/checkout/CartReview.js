import React from 'react';

const CartReview = ({ cartItems, loading, error, onProceed }) => {
  return (
    <div>
      <h3>Cart Review</h3>
      {loading && <p>Loading cart...</p>}
      {error && <p>{error}</p>}
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} – {item.quantity} x ${Number(item.price).toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <button onClick={onProceed}>Proceed to Shipping</button>
    </div>
  );
};

export default CartReview;
