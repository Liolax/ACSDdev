import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProductGrid.module.scss';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className={styles["product-grid"]}>
      {products.map((product) => (
        <div key={product._id} className={styles["product-card"]}>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
