import React from 'react';

const WishlistSection = ({
  items,
  visibleCount,
  onSeeMore,
  onSeeLess,
  onRemove,
  onMoveToCart,
}) => {
  // Only display the first `visibleCount` wishlist items.
  const visibleItems = items.slice(0, visibleCount);
  return (
    <div className="buyer-dashboard__wishlist">
      <ul className="buyer-dashboard__wishlist-list">
        {visibleItems.map((item) => (
          <li key={item.id} className="buyer-dashboard__wishlist-item">
            <img
              src={item.image}
              alt={item.name}
              className="buyer-dashboard__wishlist-image"
            />
            <span className="buyer-dashboard__wishlist-item-info">
              {item.name} –{' '}
              <span className="buyer-dashboard__wishlist-price">
                ${item.price.toFixed(2)}
              </span>
            </span>
            <div className="buyer-dashboard__wishlist-actions">
              <button
                onClick={() => onMoveToCart(item)}
                className="button buyer-dashboard__button--sm"
              >
                Move to Cart
              </button>
              <button
                onClick={() => onRemove(item.id)}
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
        {visibleCount < items.length && (
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
