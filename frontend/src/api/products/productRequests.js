import apiClient from '../axiosConfig';
import productEndpoints from './productEndpoints';

export const fetchProducts = async () => {
  try {
    const response = await apiClient.get(productEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post(productEndpoints.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await apiClient.put(productEndpoints.update(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(productEndpoints.delete.replace(':id', id));
    return response.data;
  } catch (error) {
    throw error;
  }
};