import React from 'react';

const getPriceNumber = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  if (price && typeof price === 'object' && price.$numberDecimal)
    return parseFloat(price.$numberDecimal);
  return NaN;
};

// Helper: ensures we get a proper string id even if productId is populated (an object)
const getProductId = (item) => {
  if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
    return item.productId._id.toString();
  }
  return item.productId ? item.productId.toString() : item._id?.toString() || Math.random().toString();
};

const CheckoutSummary = ({
  cart,
  currency = 'EUR',
  currencySymbol = '€',
  exchangeRate = 1,
  showCurrency = false
}) => {
  // Debug: log props on each render
  console.log('[CheckoutSummary] currency:', currency, 'currencySymbol:', currencySymbol, 'exchangeRate:', exchangeRate, 'showCurrency:', showCurrency);

  // Helper to get display price in correct currency
  const getDisplayPrice = (price) => {
    const euroPrice = getPriceNumber(price);
    if (showCurrency && exchangeRate && currency !== 'EUR') {
      const converted = euroPrice * exchangeRate;
      console.log(`[CheckoutSummary] Converting price: EUR ${euroPrice} * ${exchangeRate} = ${converted} (${currency})`);
      return converted.toFixed(2);
    }
    return euroPrice.toFixed(2);
  };

  // Helper to get symbol for display
  const getSymbol = () => {
    if (showCurrency && currencySymbol && currency !== 'EUR') {
      return currencySymbol || currency;
    }
    return '€';
  };

  // Calculate total in selected currency
  const total = cart.items.reduce((sum, item) => {
    const priceAsNumber = getPriceNumber(item.price);
    const quantityAsNumber = Number(item.quantity);
    if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
      let price = priceAsNumber;
      if (showCurrency && exchangeRate && currency !== 'EUR') {
        price = price * exchangeRate;
        console.log(`[CheckoutSummary] Item total: EUR ${priceAsNumber} * ${exchangeRate} * ${quantityAsNumber} = ${price * quantityAsNumber} (${currency})`);
      }
      return sum + price * quantityAsNumber;
    } else {
      console.error("Error calculating total for item:", item);
      return sum;
    }
  }, 0);

  return (
    <div className="checkout-summary">
      <h3>Order Summary</h3>
      <ul className="checkout-summary__list">
        {cart.items.map(item => (
          <li key={getProductId(item)}>
            {item.name} &times; {item.quantity} - {getSymbol()}
            {getDisplayPrice(item.price)}
          </li>
        ))}
      </ul>
      <p className="checkout-summary__total">
        Total: {getSymbol()}{total.toFixed(2)}
      </p>
    </div>
  );
};

export default CheckoutSummary;
