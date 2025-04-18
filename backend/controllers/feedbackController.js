import Feedback from '../models/FeedbackModel';

// Controller to handle submitting user feedback
export async function submitFeedback(req, res) {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newFeedback = new Feedback({ name, email, message });
    const savedFeedback = await newFeedback.save();

    res.status(201).json({ success: true, feedback: savedFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'An error occurred while submitting feedback.' });
  }
}

// Controller to retrieve all feedbacks
export async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Retrieve feedback sorted by newest
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'An error occurred while fetching feedbacks.' });
  }
}
