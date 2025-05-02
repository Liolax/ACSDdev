// Define API endpoints related to orders
export const ORDERS_ENDPOINTS = {
  CREATE_ORDER: '/orders',
  PAYMENT_SIMULATION: (orderId) => `/orders/${orderId}/simulate-payment`,
  GET_MY_PURCHASES: '/orders/my-purchases',
  GET_MY_SALES: '/orders/my-sales',
  MARK_SHIPPED: (orderId) => `/orders/${orderId}/ship`,
  MARK_DELIVERED: (orderId) => `/orders/${orderId}/deliver`
};