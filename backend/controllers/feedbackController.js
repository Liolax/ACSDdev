import Feedback from '../models/FeedbackModel.js';

// GET /api/feedback - Retrieve all feedback entries
export async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .populate('order', '_id');
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
}

// POST /api/feedback/create - Submit new feedback
export async function submitFeedback(req, res) {
  try {
    const { user, order, rating, title, comments } = req.body;
    if (!user || !order || !rating) {
      return res.status(400).json({ error: 'User, order, and rating are required.' });
    }
    const feedback = new Feedback({ user, order, rating, title, comments });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
}