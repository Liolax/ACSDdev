const wishlistEndpoints = {
    base: '/wishlist',
    getAll: '/wishlist',
    add: '/wishlist',
    remove: (id) => `/wishlist/${id}`,
  };
  
  export default wishlistEndpoints;
  