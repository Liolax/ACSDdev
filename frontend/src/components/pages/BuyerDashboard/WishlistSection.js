import React from 'react';
import getImageUrl from '../../../helpers/getImageUrl';
import Button from '../../ui/Button';

// Helper function to ensure a valid string id even if productId is populated as an object
const getProductId = (item) => {
    // Check if item.productId is an object (meaning it's populated) and has an _id
    if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
        return item.productId._id.toString();
    }
    // Otherwise, assume item.productId is already the ObjectId string
    return item.productId.toString();
};


const WishlistSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onMoveToCart }) => {
    // Normalize: if items is an object with an 'items' property, use that; otherwise assume it's an array.
    // This handles cases where the data might come back as { wishlist: { items: [...] } } or just [...]
    const normalizedItems = Array.isArray(items)
        ? items
        : (items && Array.isArray(items.items) ? items.items : []);

    if (normalizedItems.length === 0) {
        return <p className="buyer-dashboard__empty">Your wishlist is currently empty.</p>;
    }

    // Slice the items array based on the visibleCount prop
    const visibleItems = normalizedItems.slice(0, visibleCount);

    return (
        <div className="buyer-dashboard__wishlist">
            <ul className="buyer-dashboard__wishlist-list">
                {/* Map over the visible items to render each wishlist item */}
                {visibleItems.map((item, idx) => {
                    // Get the product ID using the helper function
                    const prodId = getProductId(item);
                    return (
                        <li key={`${prodId}-${idx}`} className="buyer-dashboard__wishlist-item">
                            {/* Product Image */}
                            <img
                                // Use getImageUrl helper for dynamic image source
                                src={item.image ? getImageUrl(item.image) : '/assets/images/default-product.png'}
                                alt={item.name}
                                className="buyer-dashboard__wishlist-image"
                                // Fallback for image loading errors
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                    e.target.src = '/assets/images/default-product.png'; // Set fallback image
                                }}
                            />
                            {/* Product Details */}
                            <div className="buyer-dashboard__wishlist-item-details">
                                <span className="buyer-dashboard__wishlist-item-info">{item.name}</span>
                                <span className="buyer-dashboard__wishlist-price">
                                    {/* Format price to 2 decimal places */}
                                    ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                                </span>
                            </div>
                            {/* Actions (Move to Cart, Remove) */}
                            <div className="buyer-dashboard__wishlist-actions">
                                <Button
                                    className="button buyer-dashboard__button--sm move-to-cart-btn"
                                    onClick={() => onMoveToCart(prodId)} // Call onMoveToCart with product ID
                                >
                                    Move to Cart
                                </Button>
                                <Button
                                    className="button buyer-dashboard__button--sm wishlist-delete-btn"
                                    onClick={() => onRemove(prodId)} // Call onRemove with product ID
                                >
                                    Remove
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {/* See More/See Less Controls */}
            <div className="buyer-dashboard__wishlist-controls">
                {/* Show See Less button if more than 5 items are visible and onSeeLess is provided */}
                {visibleCount > 5 && onSeeLess && (
                    <Button onClick={onSeeLess} className="button buyer-dashboard__button--sm see-more-btn">
                        See Less...
                    </Button>
                )}
                {/* Show See More button if there are more items than currently visible */}
                {visibleCount < normalizedItems.length && onSeeMore && (
                    <Button onClick={onSeeMore} className="button buyer-dashboard__button--sm see-more-btn">
                        See More...
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WishlistSection;
