const productEndpoints = {
    base: '/products',
    getAll: '/products',
    create: '/products',
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
  };
  
  export default productEndpoints;
  