import apiClient from '../axiosConfig';
import { WISHLIST_ENDPOINTS } from './wishlistEndpoints';

/**
 * Retrieves the current wishlist.
 */
export const getWishlist = async () => {
    try {
        const response = await apiClient.get(WISHLIST_ENDPOINTS.GET_WISHLIST);
        return response.data;
    } catch (error) {
        console.error("API Error fetching wishlist:", error);
        // Rethrow a more user-friendly error
        throw new Error(error.message || "Failed to fetch wishlist.");
    }
};

/**
 * Adds an item to the wishlist.
 * Expects: productId, name, price, image.
 */
export const addToWishlist = async (productId, name, price, image) => {
    if (!productId) throw new Error("Product ID is required.");
    if (!name || price === undefined) {
        throw new Error("Product name and price are required.");
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
        console.error("API Error adding to wishlist:", error);
        throw new Error(error.message || "Failed to add item to wishlist.");
    }
};

/**
 * Removes an item from the wishlist.
 */
export const removeFromWishlist = async (productId) => {
    if (!productId) throw new Error("Product ID is required.");
    try {
        const response = await apiClient.delete(`${WISHLIST_ENDPOINTS.REMOVE_ITEM}/${productId}`);
        return response.data;
    } catch (error) {
        console.error("API Error removing from wishlist:", error);
        throw new Error(error.message || "Failed to remove item from wishlist.");
    }
};

/**
 * Moves an item from the wishlist to the cart.
 */
export const moveWishlistItemToCart = async (productId) => {
    if (!productId) throw new Error("Product ID is required.");
    try {
        // Note: The endpoint path includes the productId as a URL parameter
        const response = await apiClient.put(`${WISHLIST_ENDPOINTS.MOVE_TO_CART}/${productId}`);
        return response.data;
    } catch (error) {
        console.error("API Error moving wishlist item to cart:", error);
        throw new Error(error.message || "Failed to move item from wishlist to cart.");
    }
};
