import apiClient from '../axiosConfig';
import PRODUCT_ENDPOINTS from './productEndpoints';

// Fetch all products (market)
export const fetchProducts = async () => {
  const res = await apiClient.get('/api/products');
  return res.data;
};

// Fetch products for the current seller
export const fetchMyProducts = async () => {
  const res = await apiClient.get('/api/products/my');
  return res.data;
};

// Create a new product (expects FormData for image upload)
export const createProduct = async (product) => {
  // product should be FormData
  const res = await apiClient.post('/api/products', product, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Update a product (expects FormData for image upload)
export const updateProduct = async (id, product) => {
  // product should be FormData
  const res = await apiClient.put(`/api/products/${id}`, product, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const res = await apiClient.delete(PRODUCT_ENDPOINTS.DELETE(id));
  return res.data;
};