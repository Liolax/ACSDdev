import apiClient from '../axiosConfig';
import wishlistEndpoints from './wishlistEndpoints';

export const getWishlist = async () => {
  try {
    const response = await apiClient.get(wishlistEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addWishlistItem = async (itemData) => {
  try {
    const response = await apiClient.post(wishlistEndpoints.add, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeWishlistItem = async (id) => {
  try {
    const response = await apiClient.delete(wishlistEndpoints.remove(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
