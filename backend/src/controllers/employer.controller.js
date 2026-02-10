const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class EmployerController {
  // Get all simulations for employer
  static async getSimulations(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const skip = (page - 1) * limit;
      const employerId = req.user.id;

      const where = { employerId };
      if (status) where.isPublished = status === 'published';
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [simulations, total] = await Promise.all([
        prisma.simulation.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            _count: {
              select: {
                invitations: true,
                submissions: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.simulation.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          simulations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get simulations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch simulations'
      });
    }
  }

  // Get single simulation
  static async getSimulation(req, res) {
    try {
      const { id } = req.params;
      const employerId = req.user.id;

      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          },
          rubric: true,
          _count: {
            select: {
              invitations: true,
              submissions: true
            }
          }
        }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      res.json({
        success: true,
        data: simulation
      });
    } catch (error) {
      console.error('Get simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch simulation'
      });
    }
  }

  // Create simulation
  static async createSimulation(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const employerId = req.user.id;
      const { title, description, duration, isBlindMode, steps, rubric } = req.body;

      const simulation = await prisma.simulation.create({
        data: {
          title,
          description,
          duration,
          isBlindMode,
          employerId,
          steps: {
            create: steps?.map((step, index) => ({
              type: step.type,
              title: step.title,
              instructions: step.instructions,
              content: step.content || {},
              order: index + 1,
              aiPersona: step.aiPersona,
              expectedOutput: step.expectedOutput || {}
            })) || []
          },
          rubric: rubric ? {
            create: {
              criteria: rubric.criteria || {},
              weights: rubric.weights || {},
              passingScore: rubric.passingScore || 70.0
            }
          } : undefined
        },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          },
          rubric: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Simulation created successfully',
        data: simulation
      });
    } catch (error) {
      console.error('Create simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create simulation'
      });
    }
  }

  // Update simulation
  static async updateSimulation(req, res) {
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
      const employerId = req.user.id;
      const { title, description, duration, isBlindMode, isPublished, steps, rubric } = req.body;

      // Check if simulation exists and belongs to employer
      const existingSimulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!existingSimulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      const updateData = {
        title,
        description,
        duration,
        isBlindMode,
        isPublished
      };

      const simulation = await prisma.simulation.update({
        where: { id },
        data: updateData,
        include: {
          steps: {
            orderBy: { order: 'asc' }
          },
          rubric: true
        }
      });

      res.json({
        success: true,
        message: 'Simulation updated successfully',
        data: simulation
      });
    } catch (error) {
      console.error('Update simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update simulation'
      });
    }
  }

  // Delete simulation
  static async deleteSimulation(req, res) {
    try {
      const { id } = req.params;
      const employerId = req.user.id;

      // Check if simulation exists and belongs to employer
      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      await prisma.simulation.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Simulation deleted successfully'
      });
    } catch (error) {
      console.error('Delete simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete simulation'
      });
    }
  }

  // Get submissions for simulation
  static async getSubmissions(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const employerId = req.user.id;

      // Verify simulation belongs to employer
      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where: { simulationId: id },
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            step: {
              select: {
                title: true,
                type: true
              }
            }
          },
          orderBy: { completedAt: 'desc' }
        }),
        prisma.submission.count({ where: { simulationId: id } })
      ]);

      res.json({
        success: true,
        data: {
          submissions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get submissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch submissions'
      });
    }
  }

  // Get single submission
  static async getSubmission(req, res) {
    try {
      const { id } = req.params;
      const employerId = req.user.id;

      const submission = await prisma.submission.findFirst({
        where: {
          id,
          simulation: { employerId }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          step: {
            select: {
              title: true,
              type: true,
              instructions: true
            }
          },
          simulation: {
            select: {
              title: true
            }
          }
        }
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      res.json({
        success: true,
        data: submission
      });
    } catch (error) {
      console.error('Get submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch submission'
      });
    }
  }

  // Update submission status
  static async updateSubmissionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const employerId = req.user.id;

      // Verify submission belongs to employer
      const submission = await prisma.submission.findFirst({
        where: {
          id,
          simulation: { employerId }
        }
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: { 
          // Add status field to submission model if needed
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Submission status updated successfully',
        data: updatedSubmission
      });
    } catch (error) {
      console.error('Update submission status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update submission status'
      });
    }
  }

  // Add feedback to submission
  static async addSubmissionFeedback(req, res) {
    try {
      const { id } = req.params;
      const { feedback, score } = req.body;
      const employerId = req.user.id;

      // Verify submission belongs to employer
      const submission = await prisma.submission.findFirst({
        where: {
          id,
          simulation: { employerId }
        }
      });

      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }

      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: {
          aiFeedback: feedback,
          score: score ? parseFloat(score) : null
        }
      });

      res.json({
        success: true,
        message: 'Feedback added successfully',
        data: updatedSubmission
      });
    } catch (error) {
      console.error('Add feedback error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add feedback'
      });
    }
  }

  // Invite candidate to simulation
  static async inviteCandidate(req, res) {
    try {
      const { id } = req.params;
      const { email, candidateId } = req.body;
      const employerId = req.user.id;

      // Verify simulation belongs to employer
      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      // Generate invitation token
      const token = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const invitation = await prisma.invitation.create({
        data: {
          simulationId: id,
          candidateId: candidateId || null,
          email,
          token,
          expiresAt,
          status: 'PENDING'
        }
      });

      // TODO: Send email invitation

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: invitation
      });
    } catch (error) {
      console.error('Invite candidate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send invitation'
      });
    }
  }

  // Get simulation invitations
  static async getSimulationInvitations(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const employerId = req.user.id;

      // Verify simulation belongs to employer
      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      const [invitations, total] = await Promise.all([
        prisma.invitation.findMany({
          where: { simulationId: id },
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
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
        prisma.invitation.count({ where: { simulationId: id } })
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
      console.error('Get simulation invitations error:', error);
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
      const employerId = req.user.id;

      const invitation = await prisma.invitation.findFirst({
        where: {
          id,
          simulation: { employerId }
        },
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

      const updatedInvitation = await prisma.invitation.update({
        where: { id },
        data: {
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
      const employerId = req.user.id;

      // Verify invitation belongs to employer
      const invitation = await prisma.invitation.findFirst({
        where: {
          id,
          simulation: { employerId }
        }
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found'
        });
      }

      await prisma.invitation.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Invitation deleted successfully'
      });
    } catch (error) {
      console.error('Delete invitation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invitation'
      });
    }
  }

  // Export simulation results
  static async exportResults(req, res) {
    try {
      const { id } = req.params;
      const { format = 'csv' } = req.query;
      const employerId = req.user.id;

      // Verify simulation belongs to employer
      const simulation = await prisma.simulation.findFirst({
        where: { id, employerId }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found'
        });
      }

      // Get all submissions for this simulation
      const submissions = await prisma.submission.findMany({
        where: { simulationId: id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          step: {
            select: {
              title: true,
              type: true
            }
          }
        },
        orderBy: { completedAt: 'desc' }
      });

      // Format data for export
      const exportData = submissions.map(submission => ({
        candidateName: `${submission.user.firstName} ${submission.user.lastName}`,
        candidateEmail: submission.user.email,
        stepTitle: submission.step.title,
        stepType: submission.step.type,
        score: submission.score || 0,
        completedAt: submission.completedAt,
        integrityFlags: submission.integrityFlags.join(', ')
      }));

      if (format === 'csv') {
        // Generate CSV
        const csv = [
          'Candidate Name,Email,Step,Type,Score,Completed At,Integrity Flags',
          ...exportData.map(row => 
            `"${row.candidateName}","${row.candidateEmail}","${row.stepTitle}","${row.stepType}",${row.score},"${row.completedAt}","${row.integrityFlags}"`
          )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="simulation-${id}-results.csv"`);
        res.send(csv);
      } else {
        res.json({
          success: true,
          data: exportData
        });
      }
    } catch (error) {
      console.error('Export results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export results'
      });
    }
  }

  // Get employer statistics
  static async getStats(req, res) {
    try {
      const employerId = req.user.id;

      const [
        totalSimulations,
        publishedSimulations,
        totalInvitations,
        totalSubmissions,
        recentSubmissions
      ] = await Promise.all([
        prisma.simulation.count({ where: { employerId } }),
        prisma.simulation.count({ where: { employerId, isPublished: true } }),
        prisma.invitation.count({
          where: {
            simulation: { employerId }
          }
        }),
        prisma.submission.count({
          where: {
            simulation: { employerId }
          }
        }),
        prisma.submission.findMany({
          where: {
            simulation: { employerId }
          },
          take: 5,
          orderBy: { completedAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            simulation: {
              select: {
                title: true
              }
            }
          }
        })
      ]);

      const stats = {
        overview: {
          totalSimulations,
          publishedSimulations,
          totalInvitations,
          totalSubmissions
        },
        recentSubmissions
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get employer stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }
}

module.exports = EmployerController;