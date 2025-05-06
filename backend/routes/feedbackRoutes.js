import { Router } from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';

const router = Router();

router.get('/', getFeedbacks);
// Add this route for seller's feedbacks
router.get('/my', getFeedbacks);
router.post('/create', submitFeedback);

export default router;