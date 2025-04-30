import apiClient from '../axiosConfig';
import { ORDERS_ENDPOINTS } from './ordersEndpoints';

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(ORDERS_ENDPOINTS.CREATE_ORDER, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(error.response?.data?.error || "Failed to create order");
  }
};

export const simulatePayment = async (orderId, paymentData) => {
  try {
    const url = ORDERS_ENDPOINTS.PAYMENT_SIMULATION.replace(':orderId', orderId);
    const response = await apiClient.post(url, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error simulating payment:", error);
    throw new Error(error.response?.data?.error || "Payment simulation failed");
  }
};

export const markShipped = async (orderId) => {
  try {
    const url = ORDERS_ENDPOINTS.MARK_SHIPPED.replace(':orderId', orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    console.error("Error marking order as shipped:", error);
    throw new Error(error.response?.data?.error || "Failed to mark order as shipped");
  }
};

export const markDelivered = async (orderId) => {
  try {
    const url = ORDERS_ENDPOINTS.MARK_DELIVERED.replace(':orderId', orderId);
    const response = await apiClient.put(url);
    return response.data;
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    throw new Error(error.response?.data?.error || "Failed to mark order as delivered");
  }
};

export const processPayment = async (orderId, paymentData) => {
  try {
    const url = ORDERS_ENDPOINTS.PROCESS_PAYMENT.replace(':orderId', orderId);
    const response = await apiClient.put(url, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw new Error(error.response?.data?.error || "Failed to process payment");
  }
};

export const addFeedback = async (orderId, feedbackData) => {
  try {
    const url = ORDERS_ENDPOINTS.ADD_FEEDBACK.replace(':orderId', orderId);
    const response = await apiClient.patch(url, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw new Error(error.response?.data?.error || "Failed to add feedback");
  }
};

export const getSales = async () => {
  try {
    const response = await apiClient.get(ORDERS_ENDPOINTS.GET_SALES);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch sales");
  }
};
