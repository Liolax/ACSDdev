import React, { useState, useEffect } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import LoginPopup from '../components/LoginPopup';
import '../assets/styles/pages/_market.scss';

// Import API functions from our central API modules.
import { getProducts } from '../api/products/productRequests';
import { addToCart } from '../api/cart/cartRequests';
import { addWishlistItem } from '../api/wishlist/wishlistRequests';

const MarketPage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // In a real app, get this info from our auth provider or context.
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Fetch products via our centralized API function.
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));

    // Simulate a logged-in user (buyer). Comment or change if needed.
    setUser({ role: 'buyer', name: 'John Doe' });
  }, []);

  const handleAddToWishlist = (productId) => {
    addWishlistItem({ productId })
      .then((data) => {
        console.log("Added to wishlist:", data);
        // Optionally show a success notification.
      })
      .catch((err) => {
        console.error("Error adding to wishlist:", err);
        // Optionally show an error notification.
      });
  };

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
      .then((data) => {
        console.log("Added to cart:", data);
        // Optionally show a success notification.
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        // Optionally show an error notification.
      });
  };

  // When a guest clicks "Details", open the login popup.
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
              // Implement your login logic here.
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
