import apiClient from '../axiosConfig';
import { CART_GET, CART_ADD, CART_UPDATE, CART_REMOVE, CART_CLEAR } from './cartEndpoints';

export const getCart = async () => {
  try {
    const response = await apiClient.get(CART_GET);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await apiClient.post(CART_ADD, { productId, quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await apiClient.put(CART_UPDATE(productId), { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await apiClient.delete(CART_REMOVE(productId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await apiClient.delete(CART_CLEAR);
    return response.data;
  } catch (error) {
    throw error;
  }
};
