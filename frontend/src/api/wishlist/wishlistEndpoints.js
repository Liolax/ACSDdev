export const WISHLIST_ENDPOINTS = {
  GET_WISHLIST: '/wishlist',
  ADD_ITEM: '/wishlist/add-item',         // POST to add an item
  REMOVE_ITEM: '/wishlist/remove-item',   // DELETE using productId as URL param
  MOVE_TO_CART: '/wishlist/move-to-cart'  // PUT using productId as URL param
};
