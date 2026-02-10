const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AdminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// Validation middleware
const updateUserStatusValidation = [
  body('isVerified').optional().isBoolean(),
  body('role').optional().isIn(['ADMIN', 'EMPLOYER', 'CANDIDATE']),
];

// Routes
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/status', updateUserStatusValidation, AdminController.updateUserStatus);
router.get('/stats', AdminController.getStats);
router.get('/logs', AdminController.getLogs);
router.get('/invitations', AdminController.getInvitations);
router.post('/invitations/:id/resend', AdminController.resendInvitation);
router.delete('/invitations/:id', AdminController.deleteInvitation);

module.exports = router;
