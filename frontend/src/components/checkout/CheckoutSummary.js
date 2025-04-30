import React from 'react';

const CheckoutSummary = ({ cart }) => {
  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="checkout-summary">
      <h3>Order Summary</h3>
      <ul className="checkout-summary__list">
        {cart.items.map(item => (
          <li key={item.productId}>
            {item.name} &times; {item.quantity} - $
            {(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="checkout-summary__total">Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default CheckoutSummary;
