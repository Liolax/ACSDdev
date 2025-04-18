const ordersEndpoints = {
  base: '/orders',
  getAll: '/orders',
  create: '/orders',
  update: (id) => `/orders/${id}`,
  delete: (id) => `/orders/${id}`,
};

export default ordersEndpoints;
