const ordersEndpoints = {
  getAll: '/orders',
  getSales: '/orders/sales',
  create: '/orders',
  markShipped: (id) => `/orders/${id}/ship`,
  markDelivered: (id) => `/orders/${id}/deliver`,
  processPayment: (id) => `/orders/${id}/processPayment`,
  addFeedback: (id) => `/orders/${id}/feedback`,
};

export default ordersEndpoints;
