import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All order routes must be authenticated

router.get('/', orderController.getAllOrders);           
router.get('/sales', orderController.getSales);            
router.post('/', orderController.createOrder);
router.post('/:orderId/paymentSimulation', orderController.simulatePayment);
router.put('/:orderId/markShipped', orderController.markShipped);     
router.put('/:orderId/markDelivered', orderController.markDelivered); 
router.patch('/:orderId/feedback', orderController.addFeedback);      

export default router;
