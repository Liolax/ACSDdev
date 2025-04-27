import axiosInstance from '../axiosConfig';
import ordersEndpoints from './ordersEndpoints';

// Retrieve all orders
export const getOrders = async () => {
  try {
    const response = await axiosInstance.get(ordersEndpoints.getAll);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(ordersEndpoints.create, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an order by ID
export const updateOrder = async (id, orderData) => {
  try {
    const response = await axiosInstance.put(ordersEndpoints.update(id), orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(ordersEndpoints.delete(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all sales for current seller
export const getSales = async () => {
  const response = await axiosInstance.get(ordersEndpoints.getSales);
  return response.data;
};
