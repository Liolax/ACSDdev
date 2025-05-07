import React, { useState } from 'react';
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

const CartSection = ({ items, visibleCount, onSeeMore, onSeeLess, onRemove, onUpdateQuantity, onPay }) => {
    // Normalize: if items is an object with an 'items' array, use that; otherwise assume items is an array.
    const normalizedItems = Array.isArray(items)
        ? items
        : (items && Array.isArray(items.items) ? items.items : []);

    const [loadingItem, setLoadingItem] = useState(null);

    if (normalizedItems.length === 0) {
        return <p className="buyer-dashboard__empty">Your cart is currently empty.</p>;
    }

    // Slice the items array based on the visibleCount prop
    const visibleItems = normalizedItems.slice(0, visibleCount);

    // Calculate the total price of items in the cart
    const total = calculateTotal(normalizedItems);

    return (
        <div className="buyer-dashboard__cart">
            <ul className="buyer-dashboard__cart-list">
                {/* Map over the visible items to render each cart item */}
                {visibleItems.map((item, idx) => {
                    // Get the product ID using the helper function
                    const prodId = getProductId(item);
                    const isLoading = loadingItem === prodId;
                    return (
                        <li key={`${prodId}-${idx}`} className="buyer-dashboard__cart-item">
                            {/* Product Image */}
                            <img
                                // Use getImageUrl helper for dynamic image source
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="buyer-dashboard__cart-image"
                                // Fallback for image loading errors
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                                    e.target.src = '/assets/images/default-product.png'; // Set fallback image
                                }}
                            />
                            {/* Product Info and Price */}
                            <div className="buyer-dashboard__cart-item-details">
                                <span className="buyer-dashboard__cart-item-info">{item.name}</span>
                                <span className="buyer-dashboard__cart-price">
                                    €{getPriceNumber(item.price).toFixed(2)}
                                </span>
                            </div>
                            {/* Quantity Controls and Delete Button */}
                            <div className="buyer-dashboard__cart-actions">
                                <div className="buyer-dashboard__quantity-controls">
                                    {/* Decrease Quantity Button */}
                                    <button
                                        key={`decrease-quantity-${idx}`}
                                        className="button quantity-button"
                                        onClick={async () => {
                                            if (item.quantity > 1 && typeof onUpdateQuantity === 'function' && !isLoading) {
                                                setLoadingItem(prodId);
                                                await onUpdateQuantity(prodId, item.quantity - 1);
                                                setLoadingItem(null);
                                            }
                                        }}
                                        disabled={item.quantity <= 1 || isLoading} // Disable button if quantity is 1 or less
                                    >
                                        -
                                    </button>
                                    {/* Current Quantity */}
                                    <span
                                        className={`quantity-display${isLoading ? ' loading' : ''}`}
                                    >
                                        {item.quantity}
                                    </span>
                                    {/* Increase Quantity Button */}
                                    <button
                                        key={`increase-quantity-${idx}`}
                                        className="button quantity-button"
                                        onClick={async () => {
                                            if (typeof onUpdateQuantity === 'function' && !isLoading) {
                                                setLoadingItem(prodId);
                                                await onUpdateQuantity(prodId, item.quantity + 1);
                                                setLoadingItem(null);
                                            }
                                        }}
                                        disabled={isLoading}
                                    >
                                        +
                                    </button>
                                    {/* Optionally, show a spinner if isLoading */}
                                    {/* {isLoading && <span className="cart-spinner">...</span>} */}
                                </div>
                                {/* Remove Button */}
                                <button
                                    key={`remove-button-${idx}`}
                                    onClick={async () => {
                                        if (typeof onRemove === 'function' && !isLoading) {
                                            setLoadingItem(prodId);
                                            await onRemove(prodId);
                                            setLoadingItem(null);
                                        }
                                    }}
                                    className="button buyer-dashboard__button--sm buyer-dashboard__cart-delete"
                                    disabled={isLoading}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {/* See More/See Less Controls */}
            <div className="buyer-dashboard__cart-controls">
                {/* Show See Less button if more than 5 items are visible and onSeeLess is provided */}
                {visibleCount > 5 && onSeeLess && (
                    <button
                        key="see-less-button"
                        onClick={() => {
                            if (typeof onSeeLess === 'function') {
                                onSeeLess();
                            }
                        }}
                        className="button buyer-dashboard__button--sm see-more-btn"
                    >
                        See Less...
                    </button>
                )}
                {/* Show See More button if there are more items than currently visible */}
                {visibleCount < normalizedItems.length && onSeeMore && (
                    <button
                        key="see-more-button"
                        onClick={() => {
                            if (typeof onSeeMore === 'function') {
                                onSeeMore();
                            }
                        }}
                        className="button buyer-dashboard__button--sm see-more-btn"
                    >
                        See More...
                    </button>
                )}
            </div>
            {/* Cart Total and Pay Button */}
            <div className="buyer-dashboard__cart-summary">
                <p>
                    Total: <span className="buyer-dashboard__cart-total">€{total.toFixed(2)}</span>
                </p>
                <button
                    key="pay-button"
                    onClick={() => {
                        if (typeof onPay === 'function') {
                            onPay();
                        }
                    }}
                    className="button buyer-dashboard__pay-button"
                >
                    Pay
                </button>
            </div>
        </div>
    );
};

export default CartSection;