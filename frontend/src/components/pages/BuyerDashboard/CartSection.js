import React from 'react';

const CartSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onPay }) => {
  // Normalize items: If items prop is an object (e.g. the entire cart), use its items array.
  const normalizedItems = Array.isArray(items)
    ? items
    : (items && Array.isArray(items.items) ? items.items : []);

  if (normalizedItems.length === 0) {
    return <p className="buyer-dashboard__empty">Your cart is currently empty.</p>;
  }
  
  const visibleItems = normalizedItems.slice(0, visibleCount);
  
  const total = normalizedItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * (Number(item.quantity) || 1),
    0
  );
  
  return (
    <div className="buyer-dashboard__cart">
      <ul className="buyer-dashboard__cart-list">
        {visibleItems.map(item => (
          <li key={item._id || item.id} className="buyer-dashboard__cart-item">
            <img 
              src={item.image || '/assets/images/default-product.png'} 
              alt={item.name} 
              className="buyer-dashboard__cart-image" 
            />
            <div className="buyer-dashboard__cart-item-details">
              <span className="buyer-dashboard__cart-item-info">
                {item.name} –{" "}
                <span className="buyer-dashboard__cart-price">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'} x {item.quantity}
                </span>
              </span>
            </div>
            <button 
              onClick={() => onRemove(item._id || item.id)} 
              className="button buyer-dashboard__button--sm buyer-dashboard__cart-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="buyer-dashboard__cart-controls">
        {visibleCount > 5 && onSeeLess && (
          <button 
            onClick={onSeeLess} 
            className="button buyer-dashboard__button--sm see-more-btn"
          >
            See Less...
          </button>
        )}
        {visibleCount < normalizedItems.length && (
          <button 
            onClick={onSeeMore} 
            className="button buyer-dashboard__button--sm see-more-btn"
          >
            See More...
          </button>
        )}
      </div>
      <div className="buyer-dashboard__cart-summary">
        <p>
          Total: <span className="buyer-dashboard__cart-total">${total.toFixed(2)}</span>
        </p>
        <button onClick={onPay} className="button buyer-dashboard__pay-button">Pay</button>
      </div>
    </div>
  );
};

export default CartSection;
