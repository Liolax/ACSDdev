import apiClient from '../axiosConfig';
import feedbackEndpoints from './feedbackEndpoints';

export const getFeedbacks = async () => {
  const res = await apiClient.get('/api/feedback');
  return res.data.feedbacks || [];
};

export const submitFeedback = async (feedbackData) => {
  const response = await apiClient.post(feedbackEndpoints.SUBMIT_FEEDBACK, feedbackData);
  return response.data;
};