const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');

/**
 * Employer Routes
 * All routes require EMPLOYER or ADMIN role
 */

/**
 * @route   GET /api/employer/simulations
 * @desc    Get all simulations for employer
 * @access  Employer/Admin
 */
router.get('/simulations', async (req, res) => {
  try {
    const userId = req.user.id;

    const simulations = [
      {
        id: '1',
        title: 'JavaScript Developer Assessment',
        description: 'Comprehensive JavaScript skills evaluation',
        difficulty: 'medium',
        duration: 60,
        status: 'active',
        candidatesInvited: 25,
        candidatesCompleted: 18,
        averageScore: 75.5,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'React Frontend Challenge',
        description: 'Build a React application',
        difficulty: 'hard',
        duration: 120,
        status: 'active',
        candidatesInvited: 15,
        candidatesCompleted: 10,
        averageScore: 68.2,
        createdAt: new Date().toISOString(),
      },
    ];

    res.json({ success: true, simulations });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch simulations' });
  }
});

/**
 * @route   GET /api/employer/simulations/:id
 * @desc    Get simulation details
 * @access  Employer/Admin
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
      status: 'active',
      questions: [
        {
          id: 'q1',
          text: 'Explain closures in JavaScript',
          type: 'essay',
          points: 20,
        },
        {
          id: 'q2',
          text: 'What is the difference between let and var?',
          type: 'multiple-choice',
          points: 10,
          options: ['Scope', 'Hoisting', 'Both', 'None'],
        },
      ],
      candidatesInvited: 25,
      candidatesCompleted: 18,
      averageScore: 75.5,
      createdAt: new Date().toISOString(),
    };

    res.json({ success: true, simulation });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch simulation' });
  }
});

/**
 * @route   POST /api/employer/simulations
 * @desc    Create new simulation
 * @access  Employer/Admin
 */
router.post('/simulations', [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('duration').isInt({ min: 15, max: 240 }),
  body('questions').isArray({ min: 1 }),
], async (req, res) => {
  try {
    const { title, description, difficulty, duration, questions } = req.body;
    const userId = req.user.id;

    const simulation = {
      id: `sim_${Date.now()}`,
      title,
      description,
      difficulty,
      duration,
      questions,
      status: 'draft',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: 'Simulation created successfully',
      simulation,
    });
  } catch (error) {
    console.error('Create simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create simulation' });
  }
});

/**
 * @route   PUT /api/employer/simulations/:id
 * @desc    Update simulation
 * @access  Employer/Admin
 */
router.put('/simulations/:id', [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('duration').optional().isInt({ min: 15, max: 240 }),
], async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    res.json({
      success: true,
      message: 'Simulation updated successfully',
      simulation: {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Update simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to update simulation' });
  }
});

/**
 * @route   DELETE /api/employer/simulations/:id
 * @desc    Delete simulation
 * @access  Employer/Admin
 */
router.delete('/simulations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Simulation deleted successfully',
    });
  } catch (error) {
    console.error('Delete simulation error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete simulation' });
  }
});

/**
 * @route   GET /api/employer/simulations/:id/submissions
 * @desc    Get submissions for a simulation
 * @access  Employer/Admin
 */
router.get('/simulations/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;

    const submissions = [
      {
        id: 'sub_1',
        candidateId: 'cand_1',
        candidateName: 'John Doe',
        candidateEmail: 'john@example.com',
        score: 85,
        status: 'completed',
        submittedAt: new Date().toISOString(),
        timeSpent: 45,
      },
      {
        id: 'sub_2',
        candidateId: 'cand_2',
        candidateName: 'Jane Smith',
        candidateEmail: 'jane@example.com',
        score: 92,
        status: 'completed',
        submittedAt: new Date().toISOString(),
        timeSpent: 52,
      },
    ];

    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

/**
 * @route   GET /api/employer/submissions/:id
 * @desc    Get submission details
 * @access  Employer/Admin
 */
router.get('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = {
      id,
      candidateId: 'cand_1',
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      simulationId: 'sim_1',
      simulationTitle: 'JavaScript Developer Assessment',
      score: 85,
      status: 'completed',
      answers: [
        {
          questionId: 'q1',
          questionText: 'Explain closures',
          answer: 'A closure is...',
          score: 18,
          maxScore: 20,
        },
      ],
      submittedAt: new Date().toISOString(),
      timeSpent: 45,
      aiEvaluation: {
        technicalScore: 85,
        communicationScore: 80,
        feedback: 'Strong technical understanding...',
      },
    };

    res.json({ success: true, submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submission' });
  }
});

/**
 * @route   PATCH /api/employer/submissions/:id/status
 * @desc    Update submission status
 * @access  Employer/Admin
 */
router.patch('/submissions/:id/status', [
  body('status').isIn(['shortlisted', 'rejected', 'reviewed']),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    res.json({
      success: true,
      message: 'Submission status updated',
      submission: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Update submission status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * @route   POST /api/employer/submissions/:id/feedback
 * @desc    Send feedback to candidate
 * @access  Employer/Admin
 */
router.post('/submissions/:id/feedback', [
  body('feedback').trim().isLength({ min: 10, max: 2000 }),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    res.json({
      success: true,
      message: 'Feedback sent successfully',
    });
  } catch (error) {
    console.error('Send feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to send feedback' });
  }
});

/**
 * @route   POST /api/employer/simulations/:id/invite
 * @desc    Invite candidates to simulation
 * @access  Employer/Admin
 */
router.post('/simulations/:id/invite', [
  body('emails').isArray({ min: 1 }),
  body('emails.*').isEmail(),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { emails } = req.body;

    res.json({
      success: true,
      message: `Invitations sent to ${emails.length} candidates`,
      invitations: emails.map(email => ({
        email,
        simulationId: id,
        status: 'sent',
        sentAt: new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error('Invite candidates error:', error);
    res.status(500).json({ success: false, message: 'Failed to send invitations' });
  }
});

/**
 * @route   GET /api/employer/simulations/:id/invitations
 * @desc    Get invitations for simulation
 * @access  Employer/Admin
 */
router.get('/simulations/:id/invitations', async (req, res) => {
  try {
    const { id } = req.params;

    const invitations = [
      {
        id: 'inv_1',
        email: 'candidate@example.com',
        status: 'pending',
        sentAt: new Date().toISOString(),
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
 * @route   POST /api/employer/invitations/:id/resend
 * @desc    Resend invitation
 * @access  Employer/Admin
 */
router.post('/invitations/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Invitation resent successfully',
    });
  } catch (error) {
    console.error('Resend invitation error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend invitation' });
  }
});

/**
 * @route   DELETE /api/employer/invitations/:id
 * @desc    Delete invitation
 * @access  Employer/Admin
 */
router.delete('/invitations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    console.error('Delete invitation error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete invitation' });
  }
});

/**
 * @route   GET /api/employer/stats
 * @desc    Get employer statistics
 * @access  Employer/Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalSimulations: 12,
      activeSimulations: 5,
      totalCandidates: 145,
      completedAssessments: 98,
      averageScore: 75.5,
      topPerformers: [
        { name: 'John Doe', score: 95 },
        { name: 'Jane Smith', score: 92 },
      ],
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

/**
 * @route   GET /api/employer/simulations/:id/export
 * @desc    Export simulation results
 * @access  Employer/Admin
 */
router.get('/simulations/:id/export', async (req, res) => {
  try {
    const { id } = req.params;

    // In production, generate CSV/Excel file
    res.json({
      success: true,
      downloadUrl: `/downloads/simulation_${id}_results.csv`,
    });
  } catch (error) {
    console.error('Export results error:', error);
    res.status(500).json({ success: false, message: 'Failed to export results' });
  }
});

module.exports = router;
