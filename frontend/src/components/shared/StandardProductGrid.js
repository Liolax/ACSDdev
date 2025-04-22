import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/shared/_standardProductGrid.scss';

const StandardProductGrid = ({ onDetails }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/products');
        // If no products returned, use dummy data
        if (!response.data || response.data.length === 0) {
          const dummyProducts = [
            { _id: '1', name: 'Product A', price: '9.99', image: 'https://picsum.photos/300/200?random=1' },
            { _id: '2', name: 'Product B', price: '14.99', image: 'https://picsum.photos/300/200?random=2' },
            { _id: '3', name: 'Product C', price: '7.99', image: 'https://picsum.photos/300/200?random=3' },
          ];
          setProducts(dummyProducts);
        } else {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products, using dummy data:', error);
        // Fallback to dummy products if error occurs
        const dummyProducts = [
          { _id: '1', name: 'Product A', price: '9.99', image: 'https://picsum.photos/300/200?random=1' },
          { _id: '2', name: 'Product B', price: '14.99', image: 'https://picsum.photos/300/200?random=2' },
          { _id: '3', name: 'Product C', price: '7.99', image: 'https://picsum.photos/300/200?random=3' },
        ];
        setProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="standard-product-grid">
      {products.map((product) => (
        <div key={product._id} className="standard-product-grid__card">
          <img
            src={product.image}
            alt={product.name}
            className="standard-product-grid__card__image"
          />
          <h3 className="standard-product-grid__card__title">{product.name}</h3>
          <p className="standard-product-grid__card__price">${product.price}</p>
          {onDetails && (
            <button className="button" onClick={() => onDetails(product)}>
              Details
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default StandardProductGrid;
