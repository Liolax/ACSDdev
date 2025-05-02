import React, { useState } from 'react';
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

const WishlistSection = ({ wishlist = [], handleRemoveWishlist, handleMoveToCart, visibleItems = 5, handleSeeLess, handleSeeMore }) => {
    const [visibleCount, setVisibleCount] = useState(visibleItems);

    if (!wishlist.length) return <div>Your wishlist is empty.</div>;

    const visibleList = wishlist.slice(0, visibleCount);

    return (
        <div className="buyer-dashboard__wishlist">
            <h2>Wishlist</h2>
            <ul className="buyer-dashboard__wishlist-list">
                {visibleList.map((item, idx) => {
                    const prodId = getProductId(item);
                    return (
                        <li key={`${prodId}-${idx}`} className="buyer-dashboard__wishlist-item">
                            <img
                                src={item.image ? getImageUrl(item.image) : '/assets/images/default-product.png'}
                                alt={item.name}
                                className="buyer-dashboard__wishlist-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/default-product.png';
                                }}
                            />
                            <div className="buyer-dashboard__wishlist-item-details">
                                <span className="buyer-dashboard__wishlist-item-info">{item.name}</span>
                                <span className="buyer-dashboard__wishlist-price">
                                    €{typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                                </span>
                            </div>
                            <div className="buyer-dashboard__wishlist-actions">
                                <Button
                                    className="button buyer-dashboard__button--sm move-to-cart-btn"
                                    onClick={() => handleMoveToCart(prodId)}
                                >
                                    Move to Cart
                                </Button>
                                <Button
                                    className="button buyer-dashboard__button--sm wishlist-delete-btn"
                                    onClick={() => handleRemoveWishlist(prodId)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="buyer-dashboard__wishlist-controls">
                {visibleCount > 5 && (
                    <Button onClick={() => { setVisibleCount(5); if (handleSeeLess) handleSeeLess(); }} className="button buyer-dashboard__button--sm see-more-btn">
                        See Less...
                    </Button>
                )}
                {visibleCount < wishlist.length && (
                    <Button onClick={() => { setVisibleCount(visibleCount + 5); if (handleSeeMore) handleSeeMore(); }} className="button buyer-dashboard__button--sm see-more-btn">
                        See More...
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WishlistSection;
