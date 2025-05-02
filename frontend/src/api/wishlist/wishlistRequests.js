import apiClient from '../axiosConfig';
import { WISHLIST_ENDPOINTS } from './wishlistEndpoints';

const handleApiError = (error) => {
  console.error("API Error:", error);
  throw new Error(error.message || "API request failed");
};

export const getWishlist = async () => {
  try {
    const response = await apiClient.get(WISHLIST_ENDPOINTS.GET_WISHLIST);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addToWishlist = async (productId, name, price, image) => {
  if (!productId || !name || price === undefined) {
    throw new Error("Product ID, name, and price are required.");
  }
  try {
    const response = await apiClient.post(WISHLIST_ENDPOINTS.ADD_ITEM, {
      productId,
      name,
      price,
      image
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const removeFromWishlist = async (productId) => {
  if (!productId) throw new Error("Product ID is required.");
  try {
    const response = await apiClient.delete(`${WISHLIST_ENDPOINTS.REMOVE_ITEM}/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const moveWishlistToCart = async (productId) => {
  if (!productId) throw new Error("Product ID is required.");
  try {
    const response = await apiClient.put(`${WISHLIST_ENDPOINTS.MOVE_TO_CART}/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
