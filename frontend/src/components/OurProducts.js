import React from 'react';
import StandardProductGrid from './shared/StandardProductGrid';
import '../assets/styles/components/_products.scss';

const OurProducts = ({ openLoginPopup }) => {
  return (
    <div className="home-page__products">
      <h2>Our Products</h2>
      <StandardProductGrid onDetails={openLoginPopup} />
    </div>
  );
};

export default OurProducts;
