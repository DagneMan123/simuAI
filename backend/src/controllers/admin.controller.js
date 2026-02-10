const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class AdminController {
  // Get all users
  static async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, status, search } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (role) where.role = role;
      if (status) where.isVerified = status === 'verified';
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            company: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  // Update user status
  static async updateUserStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { isVerified, role } = req.body;

      const updateData = {};
      if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
      if (role) updateData.role = role;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true
        }
      });

      res.json({
        success: true,
        message: 'User status updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update user status error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }
  }

  // Get platform statistics
  static async getStats(req, res) {
    try {
      const [
        totalUsers,
        totalSimulations,
        totalSubmissions,
        totalRevenue,
        usersByRole,
        recentActivity
      ] = await Promise.all([
        prisma.user.count(),
        prisma.simulation.count(),
        prisma.submission.count(),
        // Calculate actual revenue from payments
        prisma.payment.aggregate({
          where: { status: 'completed' },
          _sum: { amount: true }
        }).then(result => result._sum.amount || 0),
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
      ]);

      const stats = {
        overview: {
          totalUsers,
          totalSimulations,
          totalSubmissions,
          totalRevenue
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {}),
        recentActivity
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Get system logs (mock implementation)
  static async getLogs(req, res) {
    try {
      const { level = 'all', page = 1, limit = 50 } = req.query;

      // Fetch logs from database (if SystemLog table exists)
      // Note: You may need to create a SystemLog model in your Prisma schema
      let filteredLogs = [];
      try {
        const where = level === 'all' ? {} : { level };
        filteredLogs = await prisma.systemLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: parseInt(limit),
          skip: (parseInt(page) - 1) * parseInt(limit)
        });
      } catch (error) {
        // If SystemLog table doesn't exist, return empty array
        console.log('SystemLog table not found. Please add it to your Prisma schema.');
        filteredLogs = [];
      }

      res.json({
        success: true,
        data: {
          logs: filteredLogs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredLogs.length,
            pages: Math.ceil(filteredLogs.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch logs'
      });
    }
  }

  // Get all invitations
  static async getInvitations(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      const [invitations, total] = await Promise.all([
        prisma.invitation.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            simulation: {
              select: {
                id: true,
                title: true,
                employer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    company: true
                  }
                }
              }
            },
            candidate: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { sentAt: 'desc' }
        }),
        prisma.invitation.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          invitations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get invitations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invitations'
      });
    }
  }

  // Resend invitation
  static async resendInvitation(req, res) {
    try {
      const { id } = req.params;

      const invitation = await prisma.invitation.findUnique({
        where: { id },
        include: {
          simulation: {
            select: { title: true }
          }
        }
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found'
        });
      }

      // Update invitation with new expiry
      const updatedInvitation = await prisma.invitation.update({
        where: { id },
        data: {
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'PENDING'
        }
      });

      // TODO: Send email notification

      res.json({
        success: true,
        message: 'Invitation resent successfully',
        data: updatedInvitation
      });
    } catch (error) {
      console.error('Resend invitation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend invitation'
      });
    }
  }

  // Delete invitation
  static async deleteInvitation(req, res) {
    try {
      const { id } = req.params;

      await prisma.invitation.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Invitation deleted successfully'
      });
    } catch (error) {
      console.error('Delete invitation error:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete invitation'
      });
    }
  }
}

module.exports = AdminController;