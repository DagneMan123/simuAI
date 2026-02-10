const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class CandidateController {
  // Get available simulations for candidate
  static async getSimulations(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;
      const candidateId = req.user.id;

      const where = {
        OR: [
          // Invited simulations
          {
            invitations: {
              some: {
                candidateId,
                status: status || undefined
              }
            }
          },
          // Public simulations (if any)
          {
            isPublished: true,
            // Add any public access criteria here
          }
        ]
      };

      const [simulations, total] = await Promise.all([
        prisma.simulation.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            employer: {
              select: {
                firstName: true,
                lastName: true,
                company: true
              }
            },
            invitations: {
              where: { candidateId },
              select: {
                status: true,
                sentAt: true,
                expiresAt: true
              }
            },
            _count: {
              select: {
                steps: true
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
      console.error('Get candidate simulations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch simulations'
      });
    }
  }

  // Get single simulation for candidate
  static async getSimulation(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      const simulation = await prisma.simulation.findFirst({
        where: {
          id,
          OR: [
            {
              invitations: {
                some: { candidateId }
              }
            },
            {
              isPublished: true
            }
          ]
        },
        include: {
          employer: {
            select: {
              firstName: true,
              lastName: true,
              company: true
            }
          },
          steps: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              type: true,
              title: true,
              instructions: true,
              order: true
              // Don't include content or expectedOutput for security
            }
          },
          invitations: {
            where: { candidateId },
            select: {
              status: true,
              sentAt: true,
              expiresAt: true
            }
          }
        }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found or access denied'
        });
      }

      res.json({
        success: true,
        data: simulation
      });
    } catch (error) {
      console.error('Get candidate simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch simulation'
      });
    }
  }

  // Start simulation
  static async startSimulation(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      // Check if candidate has access to this simulation
      const simulation = await prisma.simulation.findFirst({
        where: {
          id,
          OR: [
            {
              invitations: {
                some: { 
                  candidateId,
                  status: 'PENDING',
                  expiresAt: { gt: new Date() }
                }
              }
            },
            {
              isPublished: true
            }
          ]
        }
      });

      if (!simulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found or access denied'
        });
      }

      // Check if already started
      const existingUserSimulation = await prisma.userSimulation.findUnique({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: id
          }
        }
      });

      if (existingUserSimulation) {
        return res.status(400).json({
          success: false,
          message: 'Simulation already started'
        });
      }

      // Create user simulation record
      const userSimulation = await prisma.userSimulation.create({
        data: {
          userId: candidateId,
          simulationId: id,
          status: 'IN_PROGRESS'
        }
      });

      // Update invitation status if exists
      await prisma.invitation.updateMany({
        where: {
          simulationId: id,
          candidateId,
          status: 'PENDING'
        },
        data: {
          status: 'ACCEPTED'
        }
      });

      res.json({
        success: true,
        message: 'Simulation started successfully',
        data: userSimulation
      });
    } catch (error) {
      console.error('Start simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start simulation'
      });
    }
  }

  // Submit step response
  static async submitStep(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { simId, stepId } = req.params;
      const { content, integrityFlags = [] } = req.body;
      const candidateId = req.user.id;

      // Verify user has started this simulation
      const userSimulation = await prisma.userSimulation.findUnique({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: simId
          }
        }
      });

      if (!userSimulation || userSimulation.status !== 'IN_PROGRESS') {
        return res.status(400).json({
          success: false,
          message: 'Simulation not started or already completed'
        });
      }

      // Check if step exists and belongs to simulation
      const step = await prisma.simulationStep.findFirst({
        where: {
          id: stepId,
          simulationId: simId
        }
      });

      if (!step) {
        return res.status(404).json({
          success: false,
          message: 'Step not found'
        });
      }

      // Create submission
      const submission = await prisma.submission.create({
        data: {
          userId: candidateId,
          simulationId: simId,
          stepId,
          content,
          integrityFlags
        }
      });

      res.json({
        success: true,
        message: 'Step submitted successfully',
        data: submission
      });
    } catch (error) {
      console.error('Submit step error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit step'
      });
    }
  }

  // Complete simulation
  static async completeSimulation(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      // Update user simulation status
      const userSimulation = await prisma.userSimulation.update({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: id
          }
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          timeSpent: req.body.timeSpent || null
        }
      });

      // Update invitation status
      await prisma.invitation.updateMany({
        where: {
          simulationId: id,
          candidateId
        },
        data: {
          status: 'COMPLETED'
        }
      });

      res.json({
        success: true,
        message: 'Simulation completed successfully',
        data: userSimulation
      });
    } catch (error) {
      console.error('Complete simulation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete simulation'
      });
    }
  }

  // Get simulation results
  static async getResults(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      // Check if user completed this simulation
      const userSimulation = await prisma.userSimulation.findUnique({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: id
          }
        },
        include: {
          simulation: {
            select: {
              title: true,
              description: true,
              employer: {
                select: {
                  firstName: true,
                  lastName: true,
                  company: true
                }
              }
            }
          }
        }
      });

      if (!userSimulation || userSimulation.status !== 'COMPLETED') {
        return res.status(404).json({
          success: false,
          message: 'Results not available'
        });
      }

      // Get submissions with AI feedback
      const submissions = await prisma.submission.findMany({
        where: {
          userId: candidateId,
          simulationId: id
        },
        include: {
          step: {
            select: {
              title: true,
              type: true,
              order: true
            }
          }
        },
        orderBy: {
          step: {
            order: 'asc'
          }
        }
      });

      // Calculate overall score
      const scores = submissions
        .filter(s => s.score !== null)
        .map(s => s.score);
      
      const overallScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : null;

      res.json({
        success: true,
        data: {
          userSimulation,
          submissions,
          overallScore,
          completedSteps: submissions.length,
          totalSteps: await prisma.simulationStep.count({
            where: { simulationId: id }
          })
        }
      });
    } catch (error) {
      console.error('Get results error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch results'
      });
    }
  }

  // Get candidate statistics
  static async getStats(req, res) {
    try {
      const candidateId = req.user.id;

      const [
        totalInvitations,
        completedSimulations,
        inProgressSimulations,
        averageScore,
        recentResults
      ] = await Promise.all([
        prisma.invitation.count({ where: { candidateId } }),
        prisma.userSimulation.count({
          where: {
            userId: candidateId,
            status: 'COMPLETED'
          }
        }),
        prisma.userSimulation.count({
          where: {
            userId: candidateId,
            status: 'IN_PROGRESS'
          }
        }),
        prisma.submission.aggregate({
          where: {
            userId: candidateId,
            score: { not: null }
          },
          _avg: { score: true }
        }),
        prisma.userSimulation.findMany({
          where: {
            userId: candidateId,
            status: 'COMPLETED'
          },
          take: 5,
          orderBy: { completedAt: 'desc' },
          include: {
            simulation: {
              select: {
                title: true,
                employer: {
                  select: {
                    company: true
                  }
                }
              }
            }
          }
        })
      ]);

      const stats = {
        overview: {
          totalInvitations,
          completedSimulations,
          inProgressSimulations,
          averageScore: averageScore._avg.score || 0
        },
        recentResults
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get candidate stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Get invitations
  static async getInvitations(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;
      const candidateId = req.user.id;

      const where = { candidateId };
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
                description: true,
                duration: true,
                employer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    company: true
                  }
                }
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

  // Report cheating attempt
  static async reportCheat(req, res) {
    try {
      const { id } = req.params;
      const { type, details } = req.body;
      const candidateId = req.user.id;

      // Verify user has access to this simulation
      const userSimulation = await prisma.userSimulation.findUnique({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: id
          }
        }
      });

      if (!userSimulation) {
        return res.status(404).json({
          success: false,
          message: 'Simulation not found or access denied'
        });
      }

      // Log the integrity violation
      console.log(`Integrity violation reported: ${type} by user ${candidateId} in simulation ${id}`);

      res.json({
        success: true,
        message: 'Integrity violation reported successfully',
        reportId: `report_${Date.now()}`
      });
    } catch (error) {
      console.error('Report cheat error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to report integrity violation'
      });
    }
  }

  // Get completion certificate
  static async getCertificate(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      // Check if user completed this simulation
      const userSimulation = await prisma.userSimulation.findUnique({
        where: {
          userId_simulationId: {
            userId: candidateId,
            simulationId: id
          }
        },
        include: {
          simulation: {
            select: {
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
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!userSimulation || userSimulation.status !== 'COMPLETED') {
        return res.status(404).json({
          success: false,
          message: 'Certificate not available - simulation not completed'
        });
      }

      // Calculate overall score
      const submissions = await prisma.submission.findMany({
        where: {
          userId: candidateId,
          simulationId: id
        }
      });

      const scores = submissions
        .filter(s => s.score !== null)
        .map(s => s.score);
      
      const overallScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;

      const certificate = {
        certificateId: `cert_${Date.now()}`,
        candidateName: `${userSimulation.user.firstName} ${userSimulation.user.lastName}`,
        simulationTitle: userSimulation.simulation.title,
        company: userSimulation.simulation.employer.company || 
                `${userSimulation.simulation.employer.firstName} ${userSimulation.simulation.employer.lastName}`,
        score: Math.round(overallScore),
        completedAt: userSimulation.completedAt,
        downloadUrl: `/api/candidate/simulations/${id}/certificate/download`
      };

      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      console.error('Get certificate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate certificate'
      });
    }
  }

  // Accept invitation
  static async acceptInvitation(req, res) {
    try {
      const { id } = req.params;
      const candidateId = req.user.id;

      const invitation = await prisma.invitation.findFirst({
        where: {
          id,
          candidateId,
          status: 'PENDING',
          expiresAt: { gt: new Date() }
        }
      });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: 'Invitation not found or expired'
        });
      }

      const updatedInvitation = await prisma.invitation.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      });

      res.json({
        success: true,
        message: 'Invitation accepted successfully',
        data: updatedInvitation
      });
    } catch (error) {
      console.error('Accept invitation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept invitation'
      });
    }
  }
}

module.exports = CandidateController;