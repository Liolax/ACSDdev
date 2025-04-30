export const ORDERS_ENDPOINTS = {
  GET_ALL: '/orders',
  GET_SALES: '/orders/sales',
  CREATE_ORDER: '/orders',
  MARK_SHIPPED: '/orders/:orderId/markShipped',
  MARK_DELIVERED: '/orders/:orderId/markDelivered',
  PROCESS_PAYMENT: '/orders/:orderId/processPayment',
  ADD_FEEDBACK: '/orders/:orderId/feedback',
  PAYMENT_SIMULATION: '/orders/:orderId/paymentSimulation'
};
