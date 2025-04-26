import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products/productRequests';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for adding a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: ''
  });
  // State for the image file
  const [newImageFile, setNewImageFile] = useState(null);
  
  // State for editing a product
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  
  // Search & pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };
  
  // Create product with image upload
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('description', newProduct.description);
      if (newImageFile) {
        formData.append('image', newImageFile);
      }
      const data = await createProduct(formData);
      setProducts([...products, data]);
      setNewProduct({ name: '', price: '', description: '' });
      setNewImageFile(null);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to create product');
    }
  };
  
  // Update product with new image file (optional)
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('price', editProduct.price);
      formData.append('description', editProduct.description);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }
      const data = await updateProduct(editProductId, formData);
      setProducts(products.map(p => p._id === editProductId ? data : p));
      setEditProductId(null);
      setEditProduct({ name: '', price: '', description: '' });
      setEditImageFile(null);
    } catch (err) {
      setError('Failed to update product');
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    }
  };
  
  // Filter and paginate products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="seller-dashboard">
      <h2 className="seller-dashboard__header">Manage Your Products</h2>
      {error && <p className="seller-dashboard__error">{error}</p>}
      
      {/* Search */}
      <div className="seller-dashboard__search">
        <input 
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="seller-dashboard__search-input"
        />
      </div>
      
      <button 
        className="seller-dashboard__add-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add New Product"}
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
          
          {/* Styled File Input */}
          <label className="seller-dashboard__file-label">
            Upload Product Image
            <div className="seller-dashboard__file-input-wrapper">
              <input 
                type="file"
                accept="image/*"
                className="seller-dashboard__file-input"
                onChange={(e) => setNewImageFile(e.target.files[0])}
              />
              <span className="seller-dashboard__file-name">
                {newImageFile ? newImageFile.name : "No file chosen"}
              </span>
            </div>
          </label>
          
          <button type="submit">Create Product</button>
        </form>
      )}
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="seller-dashboard__list">
          {currentProducts.map((product) => (
            <div key={product._id} className="seller-dashboard__product-card">
              <img 
                src={product.image} 
                alt={product.name} 
                className="seller-dashboard__product-image" 
              />
              <div className="seller-dashboard__product-info">
                {editProductId === product._id ? (
                  <form onSubmit={handleEditProduct} className="seller-dashboard__edit-form">
                    <input 
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      required
                    />
                    <input 
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      required
                    />
                    <textarea 
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                      required
                    ></textarea>
                    
                    {/* Styled File Input for Edit */}
                    <label className="seller-dashboard__file-label">
                      Update Product Image
                      <div className="seller-dashboard__file-input-wrapper">
                        <input 
                          type="file"
                          accept="image/*"
                          className="seller-dashboard__file-input"
                          onChange={(e) => setEditImageFile(e.target.files[0])}
                        />
                        <span className="seller-dashboard__file-name">
                          {editImageFile ? editImageFile.name : "No file chosen"}
                        </span>
                      </div>
                    </label>
                    
                    <div className="seller-dashboard__edit-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditProductId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <p>{product.description}</p>
                    <div className="seller-dashboard__product-actions">
                      <button onClick={() => {
                        setEditProductId(product._id);
                        setEditProduct({
                          name: product.name,
                          price: product.price,
                          description: product.description
                        });
                      }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
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
      
      <div className="seller-dashboard__feedback">
        <h3>Customer Feedback</h3>
        <p>Feedback and ratings from customers will appear here.</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
