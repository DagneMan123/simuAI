const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class JobController {
  // Get public jobs (no authentication required)
  static async getPublicJobs(req, res) {
    try {
      const { page = 1, limit = 10, search, location, type } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        isPublished: true,
        isActive: true
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (type) {
        where.type = type;
      }

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
            salary: true,
            description: true,
            requirements: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.job.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          jobs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get public jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs'
      });
    }
  }

  // Get single job by ID (public)
  static async getJobById(req, res) {
    try {
      const { id } = req.params;

      const job = await prisma.job.findFirst({
        where: {
          id,
          isPublished: true,
          isActive: true
        }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Get job by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job'
      });
    }
  }

  // Get jobs for authenticated users
  static async getJobs(req, res) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const skip = (page - 1) * limit;
      const userId = req.user.id;

      const where = {};

      // Filter by employer if user is employer
      if (req.user.role === 'EMPLOYER') {
        where.employerId = userId;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (status) {
        where.isPublished = status === 'published';
      }

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            _count: {
              select: {
                applications: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.job.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          jobs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs'
      });
    }
  }

  // Get job details
  static async getJobDetails(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const where = { id };

      // Filter by employer if user is employer
      if (req.user.role === 'EMPLOYER') {
        where.employerId = userId;
      }

      const job = await prisma.job.findFirst({
        where,
        include: {
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error('Get job details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job details'
      });
    }
  }

  // Create job (Employer only)
  static async createJob(req, res) {
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
      const {
        title,
        description,
        requirements,
        company,
        location,
        type,
        salary,
        benefits,
        isRemote
      } = req.body;

      const job = await prisma.job.create({
        data: {
          title,
          description,
          requirements,
          company,
          location,
          type,
          salary,
          benefits,
          isRemote,
          employerId
        }
      });

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create job'
      });
    }
  }

  // Update job
  static async updateJob(req, res) {
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

      // Check if job exists and belongs to employer
      const existingJob = await prisma.job.findFirst({
        where: { id, employerId }
      });

      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const job = await prisma.job.update({
        where: { id },
        data: req.body
      });

      res.json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job'
      });
    }
  }

  // Delete job
  static async deleteJob(req, res) {
    try {
      const { id } = req.params;
      const employerId = req.user.id;

      // Check if job exists and belongs to employer
      const job = await prisma.job.findFirst({
        where: { id, employerId }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      await prisma.job.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete job'
      });
    }
  }

  // Get job applications
  static async getJobApplications(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const employerId = req.user.id;

      // Verify job belongs to employer
      const job = await prisma.job.findFirst({
        where: { id, employerId }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where: { jobId: id },
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
          orderBy: { appliedAt: 'desc' }
        }),
        prisma.application.count({ where: { jobId: id } })
      ]);

      res.json({
        success: true,
        data: {
          applications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get job applications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications'
      });
    }
  }

  // Get AI-generated questions for job
  static async getAIQuestions(req, res) {
    try {
      const { id } = req.params;
      const employerId = req.user.id;

      // Verify job belongs to employer
      const job = await prisma.job.findFirst({
        where: { id, employerId }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Get existing AI questions for this job
      const questions = await prisma.aiQuestion.findMany({
        where: { jobId: id },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Get AI questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch AI questions'
      });
    }
  }

  // Generate AI questions for job
  static async generateAIQuestions(req, res) {
    try {
      const { id } = req.params;
      const { count = 5, difficulty = 'medium' } = req.body;
      const employerId = req.user.id;

      // Verify job belongs to employer
      const job = await prisma.job.findFirst({
        where: { id, employerId }
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Generate questions using AI service
      const aiService = require('../services/ai.service');
      const generatedQuestions = await aiService.generateQuestions({
        jobTitle: job.title,
        jobDescription: job.description,
        skills: job.requirements || [],
        difficulty: difficulty.toUpperCase(),
        count: count
      });

      // Save questions to database
      const questions = await Promise.all(
        generatedQuestions.map(q =>
          prisma.aiQuestion.create({
            data: {
              ...q,
              jobId: id
            }
          })
        )
      );

      res.json({
        success: true,
        message: `${count} AI questions generated successfully`,
        data: questions
      });
    } catch (error) {
      console.error('Generate AI questions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI questions'
      });
    }
  }
}

module.exports = JobController;