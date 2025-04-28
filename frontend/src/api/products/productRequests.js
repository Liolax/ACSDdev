import axios from '../axiosConfig';
import productEndpoints from './productEndpoints';

export const getProducts = async () => {
  try {
    const response = await axios.get(productEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(productEndpoints.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(productEndpoints.update(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(productEndpoints.delete(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
