import axiosInstance from '../axiosConfig';
import wishlistEndpoints from './wishlistEndpoints';

// Retrieve wishlist items
export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get(wishlistEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add an item to the wishlist
export const addWishlistItem = async (itemData) => {
  try {
    const response = await axiosInstance.post(wishlistEndpoints.add, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove an item from the wishlist by ID
export const removeWishlistItem = async (id) => {
  try {
    const response = await axiosInstance.delete(wishlistEndpoints.remove(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
