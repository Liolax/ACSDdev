import React from 'react';
import '../../assets/styles/components/_imagePopup.scss';
import { getImageUrl } from '../../helpers/getImageUrl';

const ImagePopup = ({ imageSrc, onClose }) => {
  // Ensure imageSrc is a string; if it already starts with 'http', use it, else compute it.
  const fullImageUrl =
    typeof imageSrc === 'string' && imageSrc.startsWith('http')
      ? imageSrc
      : getImageUrl(imageSrc);

  // Log the computed URL for debugging purposes.
  console.log("ImagePopup - fullImageUrl:", fullImageUrl);

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
