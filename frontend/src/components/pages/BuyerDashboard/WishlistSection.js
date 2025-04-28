import React from 'react';

const WishlistSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onMoveToCart }) => {
  // Normalize items.
  const normalizedItems = Array.isArray(items)
    ? items
    : (items && Array.isArray(items.items) ? items.items : []);

  if (normalizedItems.length === 0) {
    return <p className="buyer-dashboard__empty">Your wishlist is currently empty.</p>;
  }

  const visibleItems = normalizedItems.slice(0, visibleCount);

  return (
    <div className="buyer-dashboard__wishlist">
      <ul className="buyer-dashboard__wishlist-list">
        {visibleItems.map(item => (
          <li key={item._id || item.id} className="buyer-dashboard__wishlist-item">
            <img
              src={item.image || '/assets/images/default-product.png'}
              alt={item.name}
              className="buyer-dashboard__wishlist-image"
            />
            <span className="buyer-dashboard__wishlist-item-info">
              {item.name} –{" "}
              <span className="buyer-dashboard__wishlist-price">
                ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
              </span>
            </span>
            <div className="buyer-dashboard__wishlist-actions">
              <button
                onClick={() => onMoveToCart(item)}
                className="button buyer-dashboard__button--sm"
              >
                To Cart
              </button>
              <button
                onClick={() => onRemove(item._id || item.id)}
                className="button buyer-dashboard__button--sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="buyer-dashboard__wishlist-controls">
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
    </div>
  );
};

export default WishlistSection;
