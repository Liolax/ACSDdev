import Feedback from '../models/FeedbackModel.js';

// GET /api/feedback - Retrieve all feedback entries
export async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find()
      .populate('buyer', 'name email')
      .populate('order', '_id');
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
}

// POST /api/feedback/create - Submit new feedback
export async function submitFeedback(req, res) {
  try {
    const { buyer, order, rating, title, comments, itemId } = req.body;
    if (!buyer || !order || !rating) {
      return res.status(400).json({ error: 'Buyer, order, and rating are required.' });
    }
    // Optionally: store itemId if you want to relate feedback to a specific order item
    const feedback = new Feedback({ buyer, order, rating, title, comments, itemId });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
}