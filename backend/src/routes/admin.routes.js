const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

/**
 * Admin Routes
 * All routes require ADMIN role (enforced by middleware in server.js)
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Admin
 */
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['ADMIN', 'EMPLOYER', 'CANDIDATE']),
  query('status').optional().isIn(['active', 'suspended', 'pending']),
], async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;

    // Mock data - replace with actual database query
    const users = [
      {
        id: '1',
        email: 'employer@example.com',
        firstName: 'John',
        lastName: 'Employer',
        role: 'EMPLOYER',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'candidate@example.com',
        firstName: 'Jane',
        lastName: 'Candidate',
        role: 'CANDIDATE',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length,
        pages: Math.ceil(users.length / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Update user status
 * @access  Admin
 */
router.patch('/users/:id/status', [
  body('status').isIn(['active', 'suspended']),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Mock response - replace with actual database update
    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: 1250,
      totalEmployers: 150,
      totalCandidates: 1050,
      totalAdmins: 50,
      activeSimulations: 45,
      completedAssessments: 3420,
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      newUsersThisMonth: 120,
      activeUsersToday: 340,
      averageAssessmentScore: 75.5,
      topPerformingSimulations: [
        { id: '1', title: 'JavaScript Developer', completions: 450 },
        { id: '2', title: 'Python Engineer', completions: 380 },
        { id: '3', title: 'Data Analyst', completions: 320 },
      ],
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

/**
 * @route   GET /api/admin/logs
 * @desc    Get system logs
 * @access  Admin
 */
router.get('/logs', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('level').optional().isIn(['info', 'warning', 'error']),
], async (req, res) => {
  try {
    const { page = 1, limit = 50, level } = req.query;

    // Mock logs - replace with actual log retrieval
    const logs = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'User login successful',
        userId: 'user_123',
        ip: '192.168.1.1',
      },
      {
        id: '2',
        timestamp: new Date().toISOString(),
        level: 'warning',
        message: 'Failed login attempt',
        userId: null,
        ip: '192.168.1.2',
      },
    ];

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length,
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
});

/**
 * @route   GET /api/admin/invitations
 * @desc    Get all invitations
 * @access  Admin
 */
router.get('/invitations', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const invitations = [
      {
        id: '1',
        email: 'candidate@example.com',
        simulationId: 'sim_123',
        simulationTitle: 'JavaScript Developer Assessment',
        status: 'pending',
        sentAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    res.json({
      success: true,
      invitations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: invitations.length,
      },
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invitations' });
  }
});

/**
 * @route   POST /api/admin/invitations/:id/resend
 * @desc    Resend invitation
 * @access  Admin
 */
router.post('/invitations/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: 'Invitation resent successfully',
      invitation: {
        id,
        resentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Resend invitation error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend invitation' });
  }
});

/**
 * @route   DELETE /api/admin/invitations/:id
 * @desc    Delete invitation
 * @access  Admin
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

module.exports = router;
