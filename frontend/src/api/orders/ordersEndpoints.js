export const ORDERS_ENDPOINTS = {
  CREATE_ORDER: '/orders',
  PAYMENT_SIMULATION: '/orders/:orderId/paymentSimulation',
  GET_MY_PURCHASES: '/orders/my-purchases',
  GET_MY_SALES: '/orders/my-sales',
  MARK_SHIPPED: '/orders/:orderId/ship',
  MARK_DELIVERED: '/orders/:orderId/deliver'
};
