// All aspects of the ÉireCraft project – from concept to final delivery – represent my individual work and effort.
// Where AI tools (such as Copilot or ChatGPT) were used to assist with code suggestions, documentation drafting, or troubleshooting, their usage has been properly acknowledged in accordance with academic integrity guidelines.

import Feedback from '../models/FeedbackModel.js';

// Retrieve all feedback entries
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

// Submit new feedback
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