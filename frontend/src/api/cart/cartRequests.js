import apiClient from '../axiosConfig';
import { CART_ENDPOINTS } from './cartEndpoints';

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
  try {
    const response = await apiClient.post(CART_ENDPOINTS.ADD_ITEM, {
      productId,
      quantity,
      name,
      price,
      image
    });
    return response.data;
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
    return response.data;
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
    // Use the productId in the URL path for the PUT request
    const response = await apiClient.put(`${CART_ENDPOINTS.UPDATE_ITEM}/${productId}`, { quantity });
    return response.data;
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
    // Use the productId in the URL path for the DELETE request
    const response = await apiClient.delete(`${CART_ENDPOINTS.REMOVE_ITEM}/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Clears the entire cart.
 */
export const clearCart = async () => {
  try {
    // DELETE request to the base cart endpoint
    const response = await apiClient.delete(CART_ENDPOINTS.CLEAR_CART);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};