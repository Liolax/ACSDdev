import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/styles/shared/_productGrid.scss';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-grid__card">
          <img src={product.image} alt={product.name} className="product-grid__card__image" />
          <h3 className="product-grid__card__title">{product.name}</h3>
          <p className="product-grid__card__price">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

