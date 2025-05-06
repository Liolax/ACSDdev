import apiClient from '../axiosConfig';

export const createOrder = (order) => apiClient.post('/api/orders/create', order);
export const simulatePayment = (orderId, paymentDetails) =>
  apiClient.post(`/api/orders/${orderId}/simulate-payment`, { paymentDetails });
export const getMyPurchases = () => apiClient.get('/api/orders/my-purchases').then(res => res.data);
export const getMySales = () =>
  apiClient.get('/api/orders/my-sales').then(res => res.data);
export const getOrdersToShip = () =>
  apiClient.get('/api/orders/to-ship').then(res => res.data);
export const markShipped = (orderId, orderItemId) =>
  apiClient.post('/api/orders/mark-shipped', { orderId, orderItemId });
export const markDelivered = (orderId, orderItemId) =>
  apiClient.post('/api/orders/mark-delivered', { orderId, orderItemId });
export const addFeedback = (orderId, orderItemId, rating, title, comments) =>
  apiClient.post('/api/orders/add-feedback', { orderId, orderItemId, rating, title, comments });