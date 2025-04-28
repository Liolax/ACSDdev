import React from 'react';
import getImageUrl from '../../helpers/getImageUrl'; // Default import
import defaultImage from '../../assets/images/default-product.png';
import '../../assets/styles/components/_imagePopup.scss';

/**
 * ImagePopup Component: Displays a larger version of an image in an overlay.
 * @param {object} props - Component props.
 * @param {string} props.imagePath - The relative path of the image (e.g., "uploads/filename.jpg").
 * @param {function} props.onClose - Function to call when closing the popup.
 */
const ImagePopup = ({ imagePath, onClose }) => {
  const fullImageUrl = getImageUrl(imagePath);

  console.log("ImagePopup attempting to load:", fullImageUrl);

  const handleImageError = (e) => {
    console.error("ImagePopup failed to load image:", fullImageUrl, "Falling back to default.");
    e.target.onerror = null;
    e.target.src = defaultImage;
  };

  return (
    <div className="image-popup-overlay" onClick={onClose}>
      <div className="image-popup" onClick={e => e.stopPropagation()}>
        <img
          src={fullImageUrl}
          alt="Full view"
          onError={handleImageError}
          crossOrigin="anonymous"
        />
        <button className="image-popup__close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ImagePopup;
