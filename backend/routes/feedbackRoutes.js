import { Router } from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';

const router = Router();

router.get('/', getFeedbacks);
router.post('/create', submitFeedback);

export default router;