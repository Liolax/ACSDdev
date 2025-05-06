import React, { useState, useEffect } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import StandardProductGrid from '../components/shared/StandardProductGrid';
import LoginPopup from '../components/LoginPopup';
import '../assets/styles/pages/_market.scss';
import { fetchProducts } from '../api/products/productRequests';
import { addToCart } from '../api/cart/cartRequests';
import { addToWishlist } from '../api/wishlist/wishlistRequests';

const MarketPage = () => {
  const [products, setProducts] = useState([]);
  // Simulated logged-in buyer for development
  const user = { role: 'buyer', name: 'John Doe' };
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handler to add item to wishlist.
  // It passes productId, name, price, and image as required.
  const handleAddToWishlist = (productId, name, price, image) => {
    addToWishlist(productId, name, price, image)
      .then((data) => {
        console.log("Added to wishlist:", data);
      })
      .catch((err) => {
        console.error("Error adding to wishlist:", err);
      });
  };

  // Handler to add item to cart.
  // Receives product._id, quantity, name, price, image.
  const handleAddToCart = (productId, quantity, name, price, image) => {
    addToCart(productId, quantity, name, price, image)
      .then((data) => {
        console.log("Added to cart:", data);
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
      });
  };

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
        {products.map((product) =>
          product && product._id ? (
            <div key={product._id}>
              <span>Sold by: {product.seller?.name || 'Seller'}</span>
            </div>
          ) : null
        )}
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