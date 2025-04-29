import React from 'react';
// Assuming getImageUrl is also needed here for cart item images
import getImageUrl from '../../../helpers/getImageUrl'; // Import getImageUrl

// Helper: ensures we get a proper string id even if productId is populated (an object)
const getProductId = (item) => {
    // Check if item.productId is an object (meaning it's populated) and has an _id
    if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
        return item.productId._id.toString();
    }
    // Otherwise, assume item.productId is already the ObjectId string
    return item.productId.toString();
};


const CartSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onUpdateQuantity, onPay }) => {
    // Normalize: if items is an object with an 'items' array, use that; otherwise assume items is an array.
    const normalizedItems = Array.isArray(items)
        ? items
        : (items && Array.isArray(items.items) ? items.items : []);

    if (normalizedItems.length === 0) {
        return <p className="buyer-dashboard__empty">Your cart is currently empty.</p>;
    }

    // Slice the items array based on the visibleCount prop
    const visibleItems = normalizedItems.slice(0, visibleCount);

    // Calculate the total price of items in the cart
    const total = normalizedItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (Number(item.quantity) || 1),
        0
    );

    return (
        <div className="buyer-dashboard__cart">
            <ul className="buyer-dashboard__cart-list">
                {/* Map over the visible items to render each cart item */}
                {visibleItems.map((item, idx) => {
                    // Get the product ID using the helper function
                    const prodId = getProductId(item);
                    return (
                        <li key={`${prodId}-${idx}`} className="buyer-dashboard__cart-item">
                            {/* Product Image */}
                            <img
                                // Use getImageUrl helper for dynamic image source
                                src={item.image ? getImageUrl(item.image) : '/assets/images/default-product.png'}
                                alt={item.name}
                                className="buyer-dashboard__cart-image"
                                // Fallback for image loading errors
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                    e.target.src = '/assets/images/default-product.png'; // Set fallback image
                                }}
                            />
                            {/* Product Details */}
                            <div className="buyer-dashboard__cart-item-details">
                                <span className="buyer-dashboard__cart-item-info">{item.name}</span>
                                {/* Quantity Controls */}
                                <div className="buyer-dashboard__quantity-controls">
                                    {/* Decrease Quantity Button */}
                                    <button
                                        className="button quantity-button"
                                        onClick={() => onUpdateQuantity(prodId, item.quantity - 1)} // Call onUpdateQuantity with product ID and decreased quantity
                                        disabled={item.quantity <= 1} // Disable button if quantity is 1 or less
                                    >
                                        -
                                    </button>
                                    {/* Current Quantity */}
                                    <span className="quantity-display">{item.quantity}</span>
                                    {/* Increase Quantity Button */}
                                    <button
                                        className="button quantity-button"
                                        onClick={() => onUpdateQuantity(prodId, item.quantity + 1)} // Call onUpdateQuantity with product ID and increased quantity
                                    >
                                        +
                                    </button>
                                </div>
                                {/* Item Price */}
                                <span className="buyer-dashboard__cart-price">
                                    {/* Format price to 2 decimal places */}
                                    ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                                </span>
                            </div>
                            {/* Remove Button */}
                            <button
                                onClick={() => onRemove(prodId)}
                                className="button buyer-dashboard__button--sm buyer-dashboard__cart-delete"
                            >
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ul>
            {/* See More/See Less Controls */}
            <div className="buyer-dashboard__cart-controls">
                {/* Show See Less button if more than 5 items are visible and onSeeLess is provided */}
                {visibleCount > 5 && onSeeLess && (
                    <button
                        onClick={onSeeLess}
                        className="button buyer-dashboard__button--sm see-more-btn"
                    >
                        See Less...
                    </button>
                )}
                {/* Show See More button if there are more items than currently visible */}
                {visibleCount < normalizedItems.length && onSeeMore && (
                    <button
                        onClick={onSeeMore}
                        className="button buyer-dashboard__button--sm see-more-btn"
                    >
                        See More...
                    </button>
                )}
            </div>
            {/* Cart Total and Pay Button */}
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
