const ordersEndpoints = {
  getAll: '/api/orders',
  getSales: '/api/orders/sales', 
  create: '/api/orders',
  update: (id) => `/api/orders/${id}`,
  delete: (id) => `/api/orders/${id}`,
  markShipped: (id) => `/api/orders/${id}/ship`,
  markDelivered: (id) => `/api/orders/${id}/deliver`,
  addFeedback: (id) => `/api/orders/${id}/feedback`,
};

export default ordersEndpoints;