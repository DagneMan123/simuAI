const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const PaymentController = require('../controllers/payment.controller');

// Validation middleware
const initializePaymentValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['ETB', 'USD', 'EUR']).withMessage('Invalid currency'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description too long')
];

// Routes - All 5 Payment Endpoints
router.post('/initialize', initializePaymentValidation, PaymentController.initializePayment);
router.get('/verify/:reference', PaymentController.verifyPayment);
router.post('/callback', PaymentController.paymentCallback);
router.get('/history', PaymentController.getPaymentHistory);
router.get('/subscription-plans', PaymentController.getSubscriptionPlans);

module.exports = router;
