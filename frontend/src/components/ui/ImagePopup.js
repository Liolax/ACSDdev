import React from 'react';
import '../../assets/styles/components/_imagePopup.scss';

const ImagePopup = ({ imageFilename, onClose }) => {
  // Ensure that imageFilename is the file name 
  // Construct the full image URL using the backend's uploads path.
  const fullImageUrl = `http://localhost:5000/uploads/${imageFilename}`;
  
  // You can log the full URL for debugging
  console.log("ImagePopup fullImageUrl:", fullImageUrl);

  return (
    <div className="image-popup-overlay" onClick={onClose}>
      <div className="image-popup" onClick={(e) => e.stopPropagation()}>
        <img src={fullImageUrl} alt="Full view" />
        <button className="image-popup__close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ImagePopup;
