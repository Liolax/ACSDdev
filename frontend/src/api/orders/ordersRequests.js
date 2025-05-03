import apiClient from '../axiosConfig';
import { ORDERS_ENDPOINTS } from './ordersEndpoints';

const handleApiError = (error) => {
  console.error("API Error:", error);
  throw new Error(error.response?.data?.message || "API request failed");
};

/**
 * Creates a new order.
 * checkoutData should include: { cartItems, shippingInfo, paymentInfo, cartId, totalAmount }
 */
export const createOrder = async (checkoutData) => {
  try {
    if (typeof checkoutData.totalAmount !== 'number' || checkoutData.totalAmount % 1 !== 0) {
      throw new Error('Total amount must be a decimal value');
    }
    const response = await apiClient.post(ORDERS_ENDPOINTS.CREATE_ORDER, checkoutData);
    // Expect response in shape { order: ... }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Simulates payment for an order.
 * @param {string} orderId
 * @param {object} paymentDetails
 */
export const simulatePayment = async (orderId, paymentDetails) => {
  if (!orderId) throw new Error("Order ID is required for payment simulation.");
  try {
    const url = ORDERS_ENDPOINTS.PAYMENT_SIMULATION(orderId);
    // FIX: Wrap paymentDetails in an object
    const response = await apiClient.post(url, { paymentDetails });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetches orders (purchases) for the logged-in buyer.
 */
export const getMyPurchases = async () => {
  try {
    const response = await apiClient.get(ORDERS_ENDPOINTS.GET_MY_PURCHASES);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Fetches sales (orders that contain seller's products) for the logged-in seller.
 */
export const getMySales = async () => {
  try {
    const response = await apiClient.get(ORDERS_ENDPOINTS.GET_MY_SALES);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Marks an order as shipped.
 * @param {string} orderId
 */
export const markShipped = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  try {
    const url = ORDERS_ENDPOINTS.MARK_SHIPPED(orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Marks an order as delivered.
 * @param {string} orderId
 */
export const markDelivered = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  try {
    const url = ORDERS_ENDPOINTS.MARK_DELIVERED(orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};