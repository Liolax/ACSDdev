// Define API endpoints related to the cart
export const CART_ENDPOINTS = {
  GET_CART: '/api/cart', // GET request to fetch the cart
  ADD_ITEM: '/api/cart/add-item', // POST request to add an item
  UPDATE_ITEM: '/api/cart/update-item', // PUT request using productId as URL param to update item quantity
  REMOVE_ITEM: '/api/cart/remove-item', // DELETE request using productId as URL param to remove an item
  CLEAR_CART: '/api/cart/clear' // DELETE request to clear the entire cart
};