// Define API endpoints related to orders
export const ORDERS_ENDPOINTS = {
  CREATE_ORDER: '/api/orders/create',
  PAYMENT_SIMULATION: (orderId) => `/api/orders/${orderId}/simulate-payment`,
  GET_MY_PURCHASES: '/api/orders/my-purchases',
  GET_MY_SALES: '/api/orders/my-sales',
  MARK_SHIPPED: (orderId) => `/api/orders/${orderId}/ship`,
  MARK_DELIVERED: (orderId) => `/api/orders/${orderId}/deliver`
};