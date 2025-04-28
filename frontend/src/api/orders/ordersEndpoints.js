const ordersEndpoints = {
  getAll: '/orders',
  getSales: '/orders/sales',
  create: '/orders',
  markShipped: (id) => `/orders/${id}/ship`,
  markDelivered: (id) => `/orders/${id}/deliver`,
  addFeedback: (id) => `/orders/${id}/feedback`,
};

export default ordersEndpoints;
