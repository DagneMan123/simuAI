const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const CandidateController = require('../controllers/candidate.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Apply authentication and candidate role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['CANDIDATE', 'ADMIN']));

// Validation middleware
const submitStepValidation = [
  body('content').notEmpty(),
  body('integrityFlags').optional().isArray(),
];

// Routes - All 12 Candidate Endpoints
router.get('/simulations', CandidateController.getSimulations);
router.get('/simulations/:id', CandidateController.getSimulation);
router.post('/simulations/:id/start', CandidateController.startSimulation);
router.post('/simulations/:simId/steps/:stepId/submit', submitStepValidation, CandidateController.submitStep);
router.post('/simulations/:id/report-cheat', CandidateController.reportCheat);
router.post('/simulations/:id/complete', CandidateController.completeSimulation);
router.get('/simulations/:id/results', CandidateController.getResults);
router.get('/stats', CandidateController.getStats);
router.get('/invitations', CandidateController.getInvitations);
router.post('/invitations/:id/accept', CandidateController.acceptInvitation);
router.get('/simulations/:id/certificate', CandidateController.getCertificate);

module.exports = router;