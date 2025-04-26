import axiosInstance from '../axiosConfig';
import feedbackEndpoints from './feedbackEndpoints';

// Retrieve all feedback entries
export const getFeedbacks = async () => {
  try {
    const response = await axiosInstance.get(feedbackEndpoints.getAll);
    // Assuming the backend returns { feedbacks: [...] }
    return response.data.feedbacks;
  } catch (error) {
    throw error;
  }
};

// (Optional) Submit feedback, if needed in future.
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post(feedbackEndpoints.create, feedbackData);
    return response.data.feedback;
  } catch (error) {
    throw error;
  }
};
