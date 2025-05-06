import React, { useState, useEffect } from 'react';
import StandardProductGrid from './shared/StandardProductGrid';
import { fetchProducts } from '../api/products/productRequests';
import '../assets/styles/components/_products.scss';

const OurProducts = ({ user, openLoginPopup, onAddToCart, onAddToWishlist }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="home-page__products">
      <h2>Our Products</h2>
      <StandardProductGrid
        products={products}
        user={user}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onDetails={openLoginPopup}
      />
      {Array.isArray(products) && products.map((product) =>
        product && product.id ? (
          <div key={product.id}>
            <span>Sold by: {product.seller?.name || 'Seller'}</span>
          </div>
        ) : null
      )}
    </div>
  );
};

export default OurProducts;