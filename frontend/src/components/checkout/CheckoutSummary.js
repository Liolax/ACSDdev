import React from 'react';

const getPriceNumber = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  if (price && typeof price === 'object' && price.$numberDecimal)
    return parseFloat(price.$numberDecimal);
  return NaN;
};

const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const priceAsNumber = getPriceNumber(item.price);
    const quantityAsNumber = Number(item.quantity);
    if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
      return sum + (priceAsNumber * quantityAsNumber);
    } else {
      console.error("Error calculating total for item:", item);
      return sum;
    }
  }, 0);
};

// Helper: ensures we get a proper string id even if productId is populated (an object)
const getProductId = (item) => {
  if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
    return item.productId._id.toString();
  }
  return item.productId ? item.productId.toString() : item._id?.toString() || Math.random().toString();
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
          <li key={getProductId(item)}>
            {item.name} &times; {item.quantity} - $
            {(getPriceNumber(item.price) * Number(item.quantity)).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="checkout-summary__total">Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default CheckoutSummary;
