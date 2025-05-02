const productEndpoints = {
  getAll: '/products',
  create: '/products',
  update: (id) => `/products/${id}`,
  delete: '/products/:id',
};

export default productEndpoints;