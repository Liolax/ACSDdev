import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../ui/Button';
import MySales from './MySales';
import defaultImage from '../../../assets/images/default-product.png';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../../api/products/productRequests';

// Preinstalled categories – expanded list.
const categories = [
  'General',
  'Home Decor',
  'Jewelry',
  'Art',
  'Fashion',
  'Accessories',
  'Toys',
  'Pottery',
  'Woodwork',
  'Electronics',
  'Books',
  'Stationery'
];

// Use proxy for API and backend for images.
const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '');

// Helper: Build an image URL similar to the Market grid.
const getImageUrl = (image) => {
  if (!image || image.trim() === '') return defaultImage;
  const imgPath = image.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  if (imgPath.startsWith('uploads/')) {
    return `${backendUrl}/${imgPath}`;
  }
  return defaultImage;
};

const SellerDashboard = () => {
  // Order Management State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get('/api/orders');
      // If res.data has an 'orders' property, use it; otherwise assume res.data is the array.
      const ordersData = res.data && res.data.orders ? res.data.orders : res.data;
      // Ensure that ordersData is an array.
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setLoadingOrders(false);
    } catch (err) {
      setOrderError('Failed to load orders.');
      setLoadingOrders(false);
    }
  };

  const handleMarkShipped = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}/ship`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Shipped' } : o));
    } catch (err) {
      setOrderError('Failed to update order status.');
    }
  };

  // Only orders with status 'Processing' need shipping.
  const ordersToShip = orders.filter(o => o.status === 'Processing');

  // Product CRUD State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [prodError, setProdError] = useState('');

  // New product form state.
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'General',
    tags: ''
  });
  const [newImageFile, setNewImageFile] = useState(null);

  // Edit product state.
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'General',
    tags: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);

  // For search & pagination.
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setLoadingProducts(false);
    } catch (err) {
      setProdError('Failed to fetch products');
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('description', newProduct.description);
      formData.append('category', newProduct.category);
      formData.append('tags', newProduct.tags);
      if (newImageFile) {
        formData.append('image', newImageFile);
      }
      const data = await createProduct(formData);
      setProducts([...products, data.product]);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: 'General',
        tags: ''
      });
      setNewImageFile(null);
      setShowAddForm(false);
    } catch (err) {
      setProdError('Failed to add product');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('price', editProduct.price);
      formData.append('description', editProduct.description);
      formData.append('category', editProduct.category);
      formData.append('tags', editProduct.tags);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }
      const data = await updateProduct(editProductId, formData);
      setProducts(products.map(p => ((p._id || p.id) === editProductId ? data.product : p)));
      setEditProductId(null);
      setEditProduct({
        name: '',
        price: '',
        description: '',
        category: 'General',
        tags: ''
      });
      setEditImageFile(null);
    } catch (err) {
      setProdError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => ((p._id || p.id) !== productId)));
    } catch (err) {
      setProdError('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="seller-dashboard">
      <h2 className="seller-dashboard__header">Orders to Ship</h2>
      {orderError && <p className="seller-dashboard__error">{orderError}</p>}
      <div className="seller-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : ordersToShip.length === 0 ? (
          <p className="seller-dashboard__empty">No orders pending shipment.</p>
        ) : (
          ordersToShip.map(order => (
            <div key={order._id} className="order-card">
              <h3 className="order-card__id">Order {order._id}</h3>
              <p className="order-card__items-names">
                {(order.items || []).map(item => item.name).join(', ')}
              </p>
              <p className="order-card__status">Status: {order.status}</p>
              <p className="order-card__date">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
              <Button onClick={() => handleMarkShipped(order._id)}>
                Mark as Shipped
              </Button>
            </div>
          ))
        )}
      </div>

      <h2 className="seller-dashboard__header">Manage Products</h2>
      {prodError && <p className="seller-dashboard__error">{prodError}</p>}
      <div className="seller-dashboard__search">
        <input
          type="text"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="seller-dashboard__search-input"
        />
      </div>
      <button
        className="seller-dashboard__add-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : 'Add New Product'}
      </button>
      {showAddForm && (
        <form className="seller-dashboard__form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          ></textarea>
          <label>
            Category:
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newProduct.tags}
            onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
          />
          <label className="seller-dashboard__file-label">
            Upload Product Image (optional)
            <div className="seller-dashboard__file-input-wrapper">
              <input
                name="image"
                type="file"
                accept="image/*"
                className="seller-dashboard__file-input"
                onChange={(e) => setNewImageFile(e.target.files[0])}
              />
              <span className="seller-dashboard__file-name">
                {newImageFile ? newImageFile.name : 'No file chosen'}
              </span>
            </div>
          </label>
          <button type="submit">Add Product</button>
        </form>
      )}
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <div className="seller-dashboard__list">
          {currentProducts.map((product) => {
            const productId = product._id || product.id;
            const imageUrl = getImageUrl(product.image);
            return (
              <div key={productId} className="seller-dashboard__product-card">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="seller-dashboard__product-image"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  onClick={() => {
                    // For now, product images in dashboard do not open popup.
                    // You can add functionality here if desired.
                  }}
                />
                <div className="seller-dashboard__product-info">
                  {editProductId === productId ? (
                    <form onSubmit={handleEditProduct} className="seller-dashboard__edit-form">
                      <input
                        type="text"
                        value={editProduct.name}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, name: e.target.value })
                        }
                        required
                      />
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, price: e.target.value })
                        }
                        required
                      />
                      <textarea
                        value={editProduct.description}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, description: e.target.value })
                        }
                        required
                      ></textarea>
                      <label>
                        Category:
                        <select
                          value={editProduct.category}
                          onChange={(e) =>
                            setEditProduct({ ...editProduct, category: e.target.value })
                          }
                          required
                        >
                          {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </label>
                      <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={editProduct.tags}
                        onChange={(e) =>
                          setEditProduct({ ...editProduct, tags: e.target.value })
                        }
                      />
                      <label className="seller-dashboard__file-label">
                        Update Product Image (optional)
                        <div className="seller-dashboard__file-input-wrapper">
                          <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="seller-dashboard__file-input"
                            onChange={(e) => setEditImageFile(e.target.files[0])}
                          />
                          <span className="seller-dashboard__file-name">
                            {editImageFile ? editImageFile.name : 'No file chosen'}
                          </span>
                        </div>
                      </label>
                      <div className="seller-dashboard__edit-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditProductId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3>{product.name}</h3>
                      <p>${product.price}</p>
                      <p>{product.description}</p>
                      <p>
                        <strong>Category:</strong> {product.category || 'General'}
                      </p>
                      {product.tags && product.tags.length > 0 && (
                        <p>
                          <strong>Tags:</strong> {product.tags.join(', ')}
                        </p>
                      )}
                      <div className="seller-dashboard__product-actions">
                        <button
                          onClick={() => {
                            setEditProductId(productId);
                            setEditProduct({
                              name: product.name,
                              price: product.price,
                              description: product.description,
                              category: product.category,
                              tags: product.tags ? product.tags.join(', ') : ''
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(productId)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="seller-dashboard__pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`seller-dashboard__page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      <section className="seller-dashboard__feedback">
        <h3>Customer Feedback</h3>
        {/* Feedback rendering can be added here */}
      </section>
      <MySales />
    </div>
  );
};

export default SellerDashboard;
