import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../ui/Button';
import MySales from './MySales';
import defaultImage from '../../../assets/images/default-product.png';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchMyProducts
} from '../../../api/products/productRequests';
import { getFeedbacks } from '../../../api/feedback/feedbackRequests';
import { getMySales, getOrdersToShip, markShipped } from '../../../api/orders/ordersRequests';
import apiClient from '../../../api/axiosConfig';

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
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Orders to ship: now an array of order items (products to ship)
  const [toShip, setToShip] = useState([]);
  const [sales, setSales] = useState([]);

  // For "See More..." logic
  const [toShipVisible, setToShipVisible] = useState(5);
  const [salesVisible, setSalesVisible] = useState(5);

  useEffect(() => {
    setLoadingOrders(true);
    Promise.all([getMySales(), getOrdersToShip()])
      .then(([salesItems, toShipItems]) => {
        setSales(salesItems);
        setToShip(toShipItems);
        setLoadingOrders(false);
      })
      .catch(() => {
        setOrderError('Failed to fetch orders');
        setLoadingOrders(false);
      });
  }, []);

  // Refetch orders helper
  const refetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const [salesItems, toShipItems] = await Promise.all([getMySales(), getOrdersToShip()]);
      setSales(salesItems);
      setToShip(toShipItems);
    } catch {
      setOrderError('Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleMarkShipped = async (orderId, orderItemId) => {
    try {
      await markShipped(orderId, orderItemId);
      await refetchOrders(); // <-- Auto-update after marking as shipped
    } catch (err) {
      setOrderError('Failed to mark as shipped');
    }
  };

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
    const fetchProductsAsync = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchMyProducts();
        setProducts(data);
        setLoadingProducts(false);
      } catch (err) {
        setProdError('Failed to fetch products');
        setLoadingProducts(false);
      }
    };
    fetchProductsAsync();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Validate required fields before sending
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.description.trim() ||
      !newProduct.category.trim()
    ) {
      setProdError('All fields are required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name.trim());
      formData.append('price', String(newProduct.price));
      formData.append('description', newProduct.description.trim());
      formData.append('category', newProduct.category.trim());
      formData.append('tags', newProduct.tags);
      if (newImageFile) {
        formData.append('image', newImageFile); // <-- This must match backend field name
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
      setProdError('');
    } catch (err) {
      setProdError('Failed to add product');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editProduct.name.trim());
      formData.append('price', String(editProduct.price));
      formData.append('description', editProduct.description.trim());
      formData.append('category', editProduct.category.trim());
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
    p => p && typeof p.name === 'string' && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoadingFeedback(true);
      try {
        const data = await getFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        // handle error
      } finally {
        setLoadingFeedback(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Quick links logic
  const handleGoToManageProducts = () => {
    document.getElementById('manage-products-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleGoToMySales = () => {
    document.getElementById('my-sales-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="seller-dashboard">
      {/* Quick links for navigation */}
      <div className="seller-dashboard__quick-links" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 8 }}>
        <button
          type="button"
          className="seller-dashboard__quick-link"
          onClick={handleGoToManageProducts}
          style={{ cursor: 'pointer' }}
        >
          🛠️ Manage Products
        </button>
        <button
          type="button"
          className="seller-dashboard__quick-link"
          onClick={handleGoToMySales}
          style={{ cursor: 'pointer' }}
        >
          📦 My Sales
        </button>
      </div>

      {/* Products to Ship Section */}
      <h2 className="seller-dashboard__header">Products to Ship</h2>
      {orderError && <p className="seller-dashboard__error">{orderError}</p>}
      <div className="seller-dashboard__orders">
        {loadingOrders ? (
          <p>Loading products to ship...</p>
        ) : toShip.length === 0 ? (
          <p className="seller-dashboard__empty">No products pending shipment.</p>
        ) : (
          <>
            {toShip.slice(0, toShipVisible).map(item => (
              <div key={item._id} className="order-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #eab308',
                    background: '#fffbe6',
                    marginRight: 12,
                    flexShrink: 0
                  }}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 className="order-card__id" style={{ margin: 0, fontSize: '1.05rem' }}>Order {item.orderId}</h3>
                  <p className="order-card__product-name" style={{ margin: 0 }}>{item.name} (x{item.qty})</p>
                  <p className="order-card__product-status" style={{ margin: 0 }}>Status: {item.status}</p>
                </div>
                <Button onClick={() => handleMarkShipped(item.orderId, item._id)}>
                  Mark as Shipped
                </Button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              {toShipVisible > 5 && (
                <Button
                  className="see-more-btn"
                  onClick={() => setToShipVisible(5)}
                  style={{ marginRight: 8 }}
                >
                  See Less...
                </Button>
              )}
              {toShipVisible < toShip.length && (
                <Button
                  className="see-more-btn"
                  onClick={() => setToShipVisible(toShipVisible + 5)}
                >
                  See More...
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Manage Products Section */}
      <h2 className="seller-dashboard__header" id="manage-products-section">Manage Products</h2>
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
      <div id="my-sales-section" style={{ marginTop: 32 }}>
        <h2 className="seller-dashboard__header">My Sales</h2>
        <div className="my-sales__list">
          {loadingOrders ? (
            <p className="my-sales__loading">Loading sales…</p>
          ) : sales.length === 0 ? (
            <p className="my-sales__empty">No sales yet.</p>
          ) : (
            <>
              {sales.slice(0, salesVisible).map(item => (
                <div key={item._id} className="order-card my-sales__order-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #eab308',
                      background: '#fffbe6',
                      marginRight: 12,
                      flexShrink: 0
                    }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 className="order-card__id" style={{ margin: 0, fontSize: '1.05rem' }}>Order #{item.orderId}</h3>
                    <p className="order-card__product-name" style={{ margin: 0 }}>{item.name} (x{item.qty})</p>
                    <p className="order-card__product-status" style={{ margin: 0 }}>Status: {item.status}</p>
                    {item.feedback && (
                      <div className="order-card__feedback" style={{ marginTop: 4 }}>
                        <strong>Feedback:</strong>
                        <p style={{ margin: 0 }}>Rating: {item.feedback.rating} ★</p>
                        <p style={{ margin: 0 }}>Title: {item.feedback.title}</p>
                        <p style={{ margin: 0 }}>
                          Comments: {item.feedback.comments}
                          {item.feedback.edited && <span style={{ color: '#bfa800', marginLeft: 8 }}> (Edited)</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                {salesVisible > 5 && (
                  <Button
                    className="see-more-btn"
                    onClick={() => setSalesVisible(5)}
                    style={{ marginRight: 8 }}
                  >
                    See Less...
                  </Button>
                )}
                {salesVisible < sales.length && (
                  <Button
                    className="see-more-btn"
                    onClick={() => setSalesVisible(salesVisible + 5)}
                  >
                    See More...
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
