import React from 'react';

const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const priceAsNumber = parseFloat(item.price);
    const quantityAsNumber = Number(item.quantity);
    if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
      return sum + (priceAsNumber * quantityAsNumber);
    } else {
      console.error("Error calculating total for item:", item);
      return sum;
    }
  }, 0);
};

const CheckoutSummary = ({ cart }) => {
  const total = calculateTotal(cart.items);
  console.log(cart);
  console.log(cart.items);
  return (
    <div className="checkout-summary">
      <h3>Order Summary</h3>
      <ul className="checkout-summary__list">
        {cart.items.map(item => (
          <li key={item.productId}>
            {item.name} &times; {item.quantity} - $
            {(parseFloat(item.price) * Number(item.quantity)).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="checkout-summary__total">Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default CheckoutSummary;
