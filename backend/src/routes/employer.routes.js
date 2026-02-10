const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const EmployerController = require('../controllers/employer.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Apply authentication and employer role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['EMPLOYER', 'ADMIN']));

// Validation middleware
const createSimulationValidation = [
  body('title').notEmpty().isLength({ min: 3, max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('duration').isInt({ min: 15, max: 240 }),
  body('isBlindMode').optional().isBoolean(),
];

const updateSimulationValidation = [
  body('title').optional().isLength({ min: 3, max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('duration').optional().isInt({ min: 15, max: 240 }),
  body('isBlindMode').optional().isBoolean(),
  body('isPublished').optional().isBoolean(),
];

// Routes - All 15 Employer Endpoints
router.get('/simulations', EmployerController.getSimulations);
router.get('/simulations/:id', EmployerController.getSimulation);
router.post('/simulations', createSimulationValidation, EmployerController.createSimulation);
router.put('/simulations/:id', updateSimulationValidation, EmployerController.updateSimulation);
router.delete('/simulations/:id', EmployerController.deleteSimulation);
router.get('/simulations/:id/submissions', EmployerController.getSubmissions);
router.get('/submissions/:id', EmployerController.getSubmission);
router.patch('/submissions/:id/status', EmployerController.updateSubmissionStatus);
router.post('/submissions/:id/feedback', EmployerController.addSubmissionFeedback);
router.post('/simulations/:id/invite', EmployerController.inviteCandidate);
router.get('/simulations/:id/invitations', EmployerController.getSimulationInvitations);
router.post('/invitations/:id/resend', EmployerController.resendInvitation);
router.delete('/invitations/:id', EmployerController.deleteInvitation);
router.get('/stats', EmployerController.getStats);
router.get('/simulations/:id/export', EmployerController.exportResults);

module.exports = router;