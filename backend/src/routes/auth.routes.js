const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['ADMIN', 'EMPLOYER', 'CANDIDATE']),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail(),
];

const resetPasswordValidation = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
];

// Routes
router.post('/login', loginValidation, AuthController.login);
router.post('/register', registerValidation, AuthController.register);
router.post('/forgot-password', forgotPasswordValidation, AuthController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, AuthController.resetPassword);
router.post('/logout', AuthController.logout);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.get('/me', AuthController.getCurrentUser);

module.exports = router;