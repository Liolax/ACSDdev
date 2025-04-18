import axiosInstance from '../axiosConfig';
import productEndpoints from './productEndpoints';

// Retrieve all products
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(productEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(productEndpoints.create, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a product by ID
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(productEndpoints.update(id), productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(productEndpoints.delete(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
