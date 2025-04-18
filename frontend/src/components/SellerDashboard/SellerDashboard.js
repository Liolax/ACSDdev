import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import './SellerDashboard.module.scss'; // Assuming this is now using SASS

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products'); // Use our API route
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="seller-dashboard">
      <h2>Manage Your Products</h2>
      <button className="add-product-btn">Add New Product</button>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
              <button>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
