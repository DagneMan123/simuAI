const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');

/**
 * Candidate Routes
 * All routes require CANDIDATE or ADMIN role
 */

/**
 * @route   GET /api/candidate/simulations
 * @desc    Get available simulations for candidate
 * @access  Candidate/Admin
 */
router.get('/simulations', [
  query('status').optional().isIn(['available', 'in-progress', 'completed']),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
], async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, difficulty } = req.query;

    const simulations = [
      {
        id: '1',
        title: 'JavaScript Developer Assessment',
        description: 'Test your JavaScript skills',
        difficulty: 'medium',
        duration: 60,
        questions: 10,
        status: 'available',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'React Frontend Challenge',
        description: 'Build a React application',
        difficulty: 'hard',
        duration: 120,
        questions: 5,
        status: 'in-progress',
        startedAt: new Date().toISOString(),
        progress: 60,
      },
    ];

    res.json({ success: true, simulations });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch simulations' });
  }
});

/**
 * @route   GET /api/candidate/simulations/:id
 * @desc    Get simulation details
 * @access  Candidate/Admin
 */
router.get('/simulations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = {
      id,
      title: 'JavaScript Developer Assessment',
      description: 'Comprehensive JavaScript skills evaluation',
      difficulty: 'medium',
      duration: 60,
      totalQuestions: 10,
      instructions: 'Read each question carefully. You have 60 minutes to complete.',
      status: 'available',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    res.json({ success: true, simulation });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch simulation' });
  }
});

/**
 * @route   POST /api/candidate/simulations/:id/start
 * @desc    Start a simulation
 * @access  Candidate/Admin
 */
router.post('/simulations/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = {
      id: `session_${Date.now()}`,
      simulationId: id,
      userId,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      currentQuestion: 0,
      totalQuestions: 10,
      questions: [
        {
          id: 'q1',
          text: 'What is a closure in JavaScript?',
          type: 'essay',
          points: 20,
        },
        {
          id: 'q2',
          text: 'Difference between let and var?',
          type: 'multiple-choice',
          options: ['Scope', 'Hoisting', 'Both', 'None'],
          points: 10,
        },
      ],
    };

    res.json({
      success: true,
      message: 'Simulation started successfully',
      session,
    });
  } catch (error) {
    console.error('Start simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to start simulation' });
  }
});

/**
 * @route   POST /api/candidate/simulations/:simId/steps/:stepId/submit
 * @desc    Submit answer for a question
 * @access  Candidate/Admin
 */
router.post('/simulations/:simId/steps/:stepId/submit', [
  body('content').notEmpty(),
], async (req, res) => {
  try {
    const { simId, stepId } = req.params;
    const { content } = req.body;

    res.json({
      success: true,
      message: 'Answer submitted successfully',
      nextQuestion: parseInt(stepId) + 1,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
});

/**
 * @route   POST /api/candidate/simulations/:id/report-cheat
 * @desc    Report integrity violation
 * @access  Candidate/Admin
 */
router.post('/simulations/:id/report-cheat', [
  body('type').isIn(['TAB_SWITCH', 'COPY_PASTE', 'UNEXPECTED_EXIT']),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    // Log the violation
    console.log(`Integrity violation reported: ${type} for simulation ${id}`);

    res.json({
      success: true,
      message: 'Violation reported',
    });
  } catch (error) {
    console.error('Report cheat error:', error);
    res.status(500).json({ success: false, message: 'Failed to report violation' });
  }
});

/**
 * @route   POST /api/candidate/simulations/:id/complete
 * @desc    Complete simulation
 * @access  Candidate/Admin
 */
router.post('/simulations/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = {
      id: `result_${Date.now()}`,
      simulationId: id,
      userId,
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 45,
      completedAt: new Date().toISOString(),
      status: 'completed',
    };

    res.json({
      success: true,
      message: 'Simulation completed successfully',
      result,
    });
  } catch (error) {
    console.error('Complete simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete simulation' });
  }
});

/**
 * @route   GET /api/candidate/simulations/:id/results
 * @desc    Get simulation results
 * @access  Candidate/Admin
 */
router.get('/simulations/:id/results', async (req, res) => {
  try {
    const { id } = req.params;

    const results = {
      id: `result_${id}`,
      simulationId: id,
      simulationTitle: 'JavaScript Developer Assessment',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 45,
      completedAt: new Date().toISOString(),
      feedback: 'Excellent performance! Strong understanding of JavaScript concepts.',
      strengths: ['Closures', 'Async/Await', 'ES6 Features'],
      improvements: ['Error Handling', 'Performance Optimization'],
      detailedResults: [
        {
          questionId: 'q1',
          questionText: 'What is a closure?',
          yourAnswer: 'A closure is...',
          isCorrect: true,
          score: 20,
          maxScore: 20,
          feedback: 'Perfect explanation!',
        },
      ],
    };

    res.json({ success: true, results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
});

/**
 * @route   GET /api/candidate/stats
 * @desc    Get candidate statistics
 * @access  Candidate/Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalAssessments: 15,
      completedAssessments: 12,
      inProgressAssessments: 2,
      averageScore: 78.5,
      highestScore: 95,
      totalTimeSpent: 720, // minutes
      skillsAssessed: ['JavaScript', 'React', 'Node.js', 'Python'],
      recentScores: [85, 78, 92, 75, 88],
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

/**
 * @route   GET /api/candidate/invitations
 * @desc    Get candidate invitations
 * @access  Candidate/Admin
 */
router.get('/invitations', async (req, res) => {
  try {
    const invitations = [
      {
        id: 'inv_1',
        simulationId: 'sim_1',
        simulationTitle: 'JavaScript Developer Assessment',
        companyName: 'Tech Corp',
        status: 'pending',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    res.json({ success: true, invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invitations' });
  }
});

/**
 * @route   POST /api/candidate/invitations/:id/accept
 * @desc    Accept invitation
 * @access  Candidate/Admin
 */
router.post('/invitations/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Invitation accepted',
      invitation: {
        id,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept invitation' });
  }
});

/**
 * @route   GET /api/candidate/simulations/:id/certificate
 * @desc    Download certificate
 * @access  Candidate/Admin
 */
router.get('/simulations/:id/certificate', async (req, res) => {
  try {
    const { id } = req.params;

    // In production, generate PDF certificate
    res.json({
      success: true,
      certificateUrl: `/downloads/certificate_${id}.pdf`,
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate certificate' });
  }
});

module.exports = router;
