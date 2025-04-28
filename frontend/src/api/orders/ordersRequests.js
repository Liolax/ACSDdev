import axios from '../axiosConfig';
import ordersEndpoints from './ordersEndpoints';

export const getOrders = async () => {
  try {
    const response = await axios.get(ordersEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSales = async () => {
  try {
    const response = await axios.get(ordersEndpoints.getSales);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(ordersEndpoints.create, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markOrderShipped = async (id) => {
  try {
    const response = await axios.patch(ordersEndpoints.markShipped(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markOrderDelivered = async (id) => {
  try {
    const response = await axios.patch(ordersEndpoints.markDelivered(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addOrderFeedback = async (id, feedbackData) => {
  try {
    const response = await axios.patch(ordersEndpoints.addFeedback(id), feedbackData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
