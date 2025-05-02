// Define API endpoints related to the cart
export const CART_ENDPOINTS = {
  GET_CART: '/cart', // GET request to fetch the cart
  ADD_ITEM: '/cart/add-item', // POST request to add an item
  UPDATE_ITEM: '/cart/update-item', // PUT request using productId as URL param to update item quantity
  REMOVE_ITEM: '/cart/remove-item', // DELETE request using productId as URL param to remove an item
  CLEAR_CART: '/cart/clear' // DELETE request to clear the entire cart
};