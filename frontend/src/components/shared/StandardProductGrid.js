import React from 'react';
import Icon from '../ui/Icon';
import defaultImage from '../../assets/images/default-product.png';
import ImagePopup from '../ui/ImagePopup';
import '../../assets/styles/shared/_mergedProductGrid.scss'; 

// Helper for constructing image URLs.
const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const getImageUrl = (image) => {
  if (!image || image.trim() === '') return defaultImage;
  const imgPath = image.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  if (imgPath.startsWith('uploads/')) {
    const slash = backendUrl.endsWith('/') ? '' : '/';
    return `${backendUrl}${slash}${imgPath}`;
  }
  return defaultImage;
};

const StandardProductGrid = ({
  products = [],  // Default to an empty array for safety.
  user,          // Expected user object (e.g. { role: 'buyer', name: 'John Doe' }) or null.
  onAddToCart,
  onAddToWishlist,
  onDetails
}) => {
  return (
    <div className="standard-product-grid">
      {products.map(product => (
        <div className="product-card" key={product._id}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-card__image"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            style={{ cursor: 'pointer' }}
          />
          <div className="product-card__content">
            <h3 className="product-card__content__title">{product.name}</h3>
            <p className="product-card__content__price">${product.price}</p>
            <p className="product-card__content__category">
              Category: {product.category || 'General'}
            </p>
            {product.tags && product.tags.length > 0 && (
              <p className="product-card__content__tags">
                Tags: {product.tags.join(', ')}
              </p>
            )}
          </div>
          <div className="product-card__actions">
            {user && user.role === 'buyer' ? (
              <>
                <button
                  className="product-card__action-button"
                  title="Add to Wishlist"
                  onClick={() => onAddToWishlist(product._id)}
                >
                  <Icon name="heart" />
                </button>
                <button
                  className="product-card__action-button"
                  title="Add to Cart"
                  onClick={() => onAddToCart(product._id)}
                >
                  <Icon name="cart" />
                </button>
              </>
            ) : (
              <div className="details-button__wrapper">
                <button className="details-button" onClick={() => onDetails(product._id)}>
                  Details
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StandardProductGrid;
