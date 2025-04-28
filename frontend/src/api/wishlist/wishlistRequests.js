import axios from '../axiosConfig';
import wishlistEndpoints from './wishlistEndpoints';

export const getWishlist = async () => {
  try {
    const response = await axios.get(wishlistEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addWishlistItem = async (itemData) => {
  try {
    const response = await axios.post(wishlistEndpoints.add, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeWishlistItem = async (id) => {
  try {
    const response = await axios.delete(wishlistEndpoints.remove(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};
