import axiosInstance from '../axiosConfig';
import productEndpoints from './productEndpoints';

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get(productEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(productEndpoints.create, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(productEndpoints.update(id), productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(productEndpoints.delete(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
