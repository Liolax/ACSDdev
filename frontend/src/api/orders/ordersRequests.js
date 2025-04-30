import apiClient from '../axiosConfig';
import { ORDERS_ENDPOINTS } from './ordersEndpoints';

/**
 * Creates a new order.
 * checkoutData should include: { cartItems, shippingDetails }
 */
export const createOrder = async (checkoutData) => {
  try {
    const response = await apiClient.post(ORDERS_ENDPOINTS.CREATE_ORDER, checkoutData);
    return response.data;
  } catch (error) {
    console.error("API Error creating order:", error);
    throw new Error(error.response?.data?.message || "Failed to create order");
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
    const url = ORDERS_ENDPOINTS.PAYMENT_SIMULATION.replace(':orderId', orderId);
    const response = await apiClient.post(url, { paymentDetails });
    return response.data;
  } catch (error) {
    console.error("API Error simulating payment:", error);
    throw new Error(error.response?.data?.message || "Payment simulation failed");
  }
};

/**
 * Fetches orders (purchases) for the logged-in buyer.
 */
export const getMyPurchases = async () => {
  try {
    const response = await apiClient.get(ORDERS_ENDPOINTS.GET_MY_PURCHASES);
    // Ensure we return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("API Error fetching purchases:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch your purchases");
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
    console.error("API Error fetching sales:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch your sales");
  }
};

/**
 * Marks an order as shipped.
 * @param {string} orderId
 */
export const markShipped = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  try {
    const url = ORDERS_ENDPOINTS.MARK_SHIPPED.replace(':orderId', orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    console.error("API Error marking order as shipped:", error);
    throw new Error(error.response?.data?.message || "Failed to mark order as shipped");
  }
};

/**
 * Marks an order as delivered.
 * @param {string} orderId
 */
export const markDelivered = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required.");
  try {
    const url = ORDERS_ENDPOINTS.MARK_DELIVERED.replace(':orderId', orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    console.error("API Error marking order as delivered:", error);
    throw new Error(error.response?.data?.message || "Failed to mark order as delivered");
  }
};
