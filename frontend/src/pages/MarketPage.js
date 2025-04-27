import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import '../assets/styles/pages/_market.scss';

const MarketPage = () => {
  // Define the actions for wishlist and cart
  const handleAddToWishlist = (productId) => {
    // Replace with your wishlist logic/API call if needed
    console.log("Adding product to wishlist:", productId);
  };

  const handleAddToCart = (productId) => {
    // Replace with your cart logic/API call if needed
    console.log("Adding product to cart:", productId);
  };

  return (
    <div className="page-container market-page">
      <Header />
      <main className="market-page__main-content">
        <StandardProductGrid 
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
        />
      </main>
      <Footer />
    </div>
  );
};

export default MarketPage;
