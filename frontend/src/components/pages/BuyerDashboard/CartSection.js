import React from 'react';

const CartSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onPay }) => {
  // Only show the first `visibleCount` cart items.
  const visibleItems = items.slice(0, visibleCount);
  // Calculate the total price from all items.
  const total = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  return (
    // Wrap the cart items in the proper parent container.
    <div className="buyer-dashboard__cart">
      <ul className="buyer-dashboard__cart-list">
        {visibleItems.map((item) => (
          <li key={item.id} className="buyer-dashboard__cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="buyer-dashboard__cart-image"
            />
            <span className="buyer-dashboard__cart-item-info">
              {item.name} – 
              <span className="buyer-dashboard__cart-price">
                ${item.price.toFixed(2)} x {item.quantity}
              </span>
            </span>
            <button 
              onClick={() => onRemove(item.id)} 
              className="button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="buyer-dashboard__cart-controls">
        {visibleCount > 5 && onSeeLess && (
          <button onClick={onSeeLess} className="button">See Less...</button>
        )}
        {visibleCount < items.length && (
          <button onClick={onSeeMore} className="button">See More...</button>
        )}
      </div>
      <div className="buyer-dashboard__cart-summary">
        <p>
          Total: <span className="buyer-dashboard__cart-total">${total.toFixed(2)}</span>
        </p>
        <button onClick={onPay} className="button buyer-dashboard__pay-button">
          Pay
        </button>
      </div>
    </div>
  );
};

export default CartSection;
