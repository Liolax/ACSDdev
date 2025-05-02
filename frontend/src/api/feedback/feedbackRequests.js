import apiClient from '../axiosConfig';
import feedbackEndpoints from './feedbackEndpoints';

export const getFeedbacks = async () => {
  const response = await apiClient.get(feedbackEndpoints.getAll);
  return response.data.feedbacks;
};

export const submitFeedback = async (feedbackData) => {
  const response = await apiClient.post(feedbackEndpoints.create, feedbackData);
  return response.data;
};