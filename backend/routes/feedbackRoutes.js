import { Router } from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';
const router = Router();

// GET /api/feedback - Retrieve all feedback entries
router.get('/', async (req, res) => {
  try {
    await getFeedbacks(req, res);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks', error });
  }
});

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    await submitFeedback(req, res);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

export default router;

