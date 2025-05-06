import apiClient from '../axiosConfig';
import { CART_ENDPOINTS } from './cartEndpoints';

// All endpoints should use /api/cart via CART_ENDPOINTS

const handleApiError = (error) => {
  console.error("API Error:", error);
  throw new Error(error.message || "API request failed");
};

/**
 * Adds an item to the cart.
 * Expects: productId, quantity, name, price, image.
 */
export const addToCart = async (productId, quantity = 1, name, price, image) => {
  if (!productId) throw new Error("Product ID is required.");
  if (!name || price === undefined) {
    throw new Error("Product name and price are required.");
  }
  // Always send price as a number for cart (backend expects Number)
  let safePrice = price;
  if (typeof safePrice === 'string') {
    safePrice = Number(safePrice);
  }
  try {
    const res = await apiClient.post(CART_ENDPOINTS.ADD_ITEM, {
      productId,
      quantity,
      name,
      price: safePrice,
      image
    });
    return res.data.cart;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Retrieves the current cart.
 */
export const getCart = async () => {
  try {
    const response = await apiClient.get(CART_ENDPOINTS.GET_CART);
    return response.data.cart;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Updates the quantity for a cart item.
 */
export const updateCartItemQuantity = async (productId, quantity) => {
  if (!productId || quantity < 1) {
    throw new Error("Product ID and valid quantity are required.");
  }
  try {
    const res = await apiClient.put(`${CART_ENDPOINTS.UPDATE_ITEM}/${productId}`, { quantity });
    return res.data.cart;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Removes an item from the cart.
 */
export const removeFromCart = async (productId) => {
  if (!productId) throw new Error("Product ID is required.");
  try {
    const res = await apiClient.delete(`${CART_ENDPOINTS.REMOVE_ITEM}/${productId}`);
    return res.data.cart;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Clears the entire cart.
 */
export const clearCart = async () => {
  try {
    const res = await apiClient.delete(CART_ENDPOINTS.CLEAR_CART);
    return res.data.cart;
  } catch (error) {
    handleApiError(error);
  }
};