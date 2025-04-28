import React from 'react';
import axios from '../api/axiosConfig';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import '../assets/styles/pages/_market.scss';

const MarketPage = () => {
  const handleAddToWishlist = (productId) => {
    axios
      .post('/api/wishlist', { productId })
      .then((res) => console.log("Added to wishlist:", res.data))
      .catch((err) => console.error("Error adding to wishlist:", err));
  };

  const handleAddToCart = (productId) => {
    axios
      .post('/api/cart', { productId, quantity: 1 })
      .then((res) => console.log("Added to cart:", res.data))
      .catch((err) => console.error("Error adding to cart:", err));
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
