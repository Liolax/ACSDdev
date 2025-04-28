import apiClient from '../axiosConfig';
import ordersEndpoints from './ordersEndpoints';

export const getOrders = async () => {
  try {
    const response = await apiClient.get(ordersEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSales = async () => {
  try {
    const response = await apiClient.get(ordersEndpoints.getSales);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(ordersEndpoints.create, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markOrderShipped = async (orderId) => {
  try {
    const response = await apiClient.patch(ordersEndpoints.markShipped(orderId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markOrderDelivered = async (orderId) => {
  try {
    const response = await apiClient.patch(ordersEndpoints.markDelivered(orderId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (orderId, paymentDetails) => {
  try {
    const response = await apiClient.patch(ordersEndpoints.processPayment(orderId), paymentDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addOrderFeedback = async (orderId, feedbackData) => {
  try {
    const response = await apiClient.patch(ordersEndpoints.addFeedback(orderId), feedbackData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
