import axiosInstance from '../axiosConfig';
import feedbackEndpoints from './feedbackEndpoints';

// Retrieve all feedback entries
export const getFeedbacks = async () => {
  try {
    const response = await axiosInstance.get(feedbackEndpoints.getAll);
    // Assuming the backend returns an object with a `feedbacks` array
    return response.data.feedbacks;
  } catch (error) {
    throw error;
  }
};

// (Optional) Function to submit feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axiosInstance.post(feedbackEndpoints.create, feedbackData);
    return response.data.feedback; // Assuming response returns { feedback: ... }
  } catch (error) {
    throw error;
  }
};
