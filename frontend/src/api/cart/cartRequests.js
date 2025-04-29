import apiClient from '../axiosConfig';
import { CART_ENDPOINTS } from './cartEndpoints';

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
        console.error("API Error adding to cart:", error);
        throw new Error(error.message || "Failed to add item to cart.");
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
        console.error("API Error fetching cart:", error);
        throw new Error(error.message || "Failed to fetch cart.");
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
        console.error("API Error updating cart quantity:", error);
        throw new Error(error.message || "Failed to update cart quantity.");
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
        console.error("API Error removing from cart:", error);
        throw new Error(error.message || "Failed to remove item from cart.");
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
        console.error("API Error clearing cart:", error);
        throw new Error(error.message || "Failed to clear cart.");
    }
};

// Note: The moveWishlistItemToCart function seems to be defined in both
// wishlistRequests.js and cartRequests.js in your provided code.
// It's better to have a single source of truth for this logic.
// Since the backend route for moving is in wishlistRoutes,
// it makes more sense to keep the `moveWishlistItemToCart` function
// in `frontend/src/api/wishlist/wishlistRequests.js` and call that function
// from your components when moving an item.
// The implementation below seems to be attempting a POST to a non-existent
// /cart/move-from-wishlist endpoint based on your backend routes provided earlier.
// I will comment it out or remove it to avoid confusion and potential errors.

/*
// This function seems redundant and points to a backend endpoint
// not present in your provided backend routes.
// The move logic is handled by wishlistController.moveWishlistToCart
// and exposed via the PUT /wishlist/move-to-cart/:productId route.
// You should call the moveWishlistItemToCart function from wishlistRequests.js instead.
export const moveWishlistItemToCart = async (wishlistItemId, productId) => {
    if (!wishlistItemId || !productId)
        throw new Error("Both Wishlist Item ID and Product ID are required.");
    try {
        // This endpoint '/cart/move-from-wishlist' is not defined in your backend routes
        const response = await apiClient.post(`${CART_ENDPOINTS.ADD_ITEM}/move-from-wishlist`, {
            wishlistItemId,
            productId,
            quantity: 1
        });
        return response.data;
    } catch (error) {
        console.error("API Error moving wishlist item to cart:", error);
        throw new Error(error.message || "Failed to move item from wishlist to cart.");
    }
};
*/
