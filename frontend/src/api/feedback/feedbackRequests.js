import apiClient from '../axiosConfig';
import feedbackEndpoints from './feedbackEndpoints';

export const getFeedbacks = async () => {
  try {
    const response = await apiClient.get(feedbackEndpoints.getAll);
    // Assuming the response has { feedbacks: [...] }
    return response.data.feedbacks;
  } catch (error) {
    throw error;
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post(feedbackEndpoints.create, feedbackData);
    // Assuming the response returns { feedback: ... }
    return response.data.feedback;
  } catch (error) {
    throw error;
  }
};
