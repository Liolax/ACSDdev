import apiClient from '../axiosConfig';
import { WISHLIST_ENDPOINTS } from './wishlistEndpoints';

const handleApiError = (error) => {
  console.error("API Error:", error);
  throw new Error(error.message || "API request failed");
};

export const getWishlist = async () => {
  try {
    const response = await apiClient.get(WISHLIST_ENDPOINTS.GET_WISHLIST);
    return response.data.wishlist;
  } catch (error) {
    handleApiError(error);
  }
};

export const addToWishlist = async (productId, name, price, image) => {
  if (!productId || !name || price === undefined) {
    throw new Error("Product ID, name, and price are required.");
  }
  // Always send price as a number for wishlist (backend expects Number)
  let safePrice = price;
  if (typeof safePrice === 'string') {
    safePrice = Number(safePrice);
  }
  try {
    const response = await apiClient.post(WISHLIST_ENDPOINTS.ADD_ITEM, {
      productId,
      name,
      price: safePrice,
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
    // No price in request body, but backend will use wishlist item's price.
    // If you ever need to send price, ensure it's a string with two decimals:
    // price: Number(price).toFixed(2)
    const response = await apiClient.put(`${WISHLIST_ENDPOINTS.MOVE_TO_CART}/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
