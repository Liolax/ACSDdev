export const WISHLIST_ENDPOINTS = {
  GET_WISHLIST: '/api/wishlist',
  ADD_ITEM: '/api/wishlist/add-item',         // POST to add an item
  REMOVE_ITEM: '/api/wishlist/remove-item',   // DELETE using productId as URL param
  MOVE_TO_CART: '/api/wishlist/move-to-cart'  // PUT using productId as URL param
};
