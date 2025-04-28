import React from 'react';
import '../../assets/styles/components/_imagePopup.scss';
import { getImageUrl } from '../../helpers/getImageUrl';

const ImagePopup = ({ imageSrc, onClose }) => {
  const fullImageUrl = getImageUrl(imageSrc);

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
