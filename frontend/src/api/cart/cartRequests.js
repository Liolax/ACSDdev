import axios from 'axios';
import {
  CART_GET,
  CART_ADD,
  CART_UPDATE,
  CART_REMOVE,
  CART_CLEAR
} from './cartEndpoints';

export const getCart = async () => {
  const response = await axios.get(CART_GET);
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axios.post(CART_ADD, { productId, quantity });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await axios.put(CART_UPDATE(productId), { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await axios.delete(CART_REMOVE(productId));
  return response.data;
};

export const clearCart = async () => {
  const response = await axios.delete(CART_CLEAR);
  return response.data;
};