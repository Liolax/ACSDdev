import React, { useState, useEffect } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import LoginPopup from '../components/LoginPopup';
import '../assets/styles/pages/_market.scss';
import { getProducts } from '../api/products/productRequests';
import { addToCart } from '../api/cart/cartRequests';
import { addWishlistItem } from '../api/wishlist/wishlistRequests';

const MarketPage = () => {
  const [products, setProducts] = useState([]);
  // Simulated logged-in buyer (no setUser needed)
  const user = { role: 'buyer', name: 'John Doe' };
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToWishlist = (productId) => {
    addWishlistItem({ productId })
      .then((data) => {
        console.log("Added to wishlist:", data);
      })
      .catch((err) => {
        console.error("Error adding to wishlist:", err);
      });
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
      .then((data) => {
        console.log("Added to cart:", data);
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
      });
  };

  // For guests, clicking "Details" opens the login popup.
  const handleDetails = (productId) => {
    setShowLogin(true);
  };

  return (
    <div className="page-container market-page">
      <Header />
      <main className="market-page__main-content">
        <StandardProductGrid 
          products={products}
          user={user}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
          onDetails={handleDetails}
        />
        {showLogin && (
          <LoginPopup 
            onClose={() => setShowLogin(false)}
            handleLogin={(email, password, rememberMe, role) => {
              console.log("Logging in:", email, password, rememberMe, role);
              setShowLogin(false);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MarketPage;
