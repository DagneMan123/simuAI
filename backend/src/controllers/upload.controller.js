const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

class UploadController {
  /**
   * @route   POST /api/upload
   * @desc    Upload single file
   * @access  Private
   */
  static async uploadSingleFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          userId: req.user.id,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: fileUrl,
          type: 'GENERAL'
        }
      });

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          file: {
            id: fileRecord.id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
          }
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/upload/multiple
   * @desc    Upload multiple files
   * @access  Private
   */
  static async uploadMultipleFiles(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const fileRecords = [];

      // Process each file
      for (const file of req.files) {
        const fileUrl = `/uploads/${file.filename}`;
        
        const fileRecord = await prisma.file.create({
          data: {
            userId: req.user.id,
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: fileUrl,
            type: 'GENERAL'
          }
        });

        fileRecords.push({
          id: fileRecord.id,
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: fileUrl,
        });
      }

      res.json({
        success: true,
        message: `${fileRecords.length} files uploaded successfully`,
        data: {
          files: fileRecords
        }
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/upload/avatar
   * @desc    Upload user avatar
   * @access  Private
   */
  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No avatar uploaded',
        });
      }

      // Validate it's an image
      if (!req.file.mimetype.startsWith('image/')) {
        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Avatar must be an image file',
        });
      }

      const avatarUrl = `/uploads/${req.file.filename}`;

      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          userId: req.user.id,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: avatarUrl,
          type: 'AVATAR'
        }
      });

      // Update user avatar in database
      await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
      });

      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatarUrl,
          fileId: fileRecord.id
        }
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Avatar upload failed',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/upload/resume
   * @desc    Upload resume/CV
   * @access  Private (Candidate)
   */
  static async uploadResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No resume uploaded',
        });
      }

      // Validate file type (PDF or DOC)
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Resume must be a PDF or DOC file',
        });
      }

      const resumeUrl = `/uploads/${req.file.filename}`;

      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          userId: req.user.id,
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: resumeUrl,
          type: 'RESUME'
        }
      });

      // Update candidate profile with resume
      if (req.user.role === 'CANDIDATE') {
        await prisma.candidateProfile.update({
          where: { userId: req.user.id },
          data: { resumeUrl }
        });
      }

      res.json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          resumeUrl,
          fileId: fileRecord.id
        }
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Resume upload failed',
        error: error.message,
      });
    }
  }

  /**
   * @route   DELETE /api/upload/:filename
   * @desc    Delete uploaded file
   * @access  Private
   */
  static async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      const userId = req.user.id;

      // Find file record in database
      const fileRecord = await prisma.file.findFirst({
        where: {
          filename,
          userId // Ensure user can only delete their own files
        }
      });

      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found or access denied',
        });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);

      // Check if file exists on disk
      if (fs.existsSync(filePath)) {
        // Delete file from disk
        fs.unlinkSync(filePath);
      }

      // Delete file record from database
      await prisma.file.delete({
        where: { id: fileRecord.id }
      });

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'File deletion failed',
        error: error.message,
      });
    }
  }

  /**
   * @route   GET /api/upload/files
   * @desc    Get user's uploaded files
   * @access  Private
   */
  static async getUserFiles(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type } = req.query;
      const skip = (page - 1) * limit;

      const where = { userId };
      if (type) where.type = type;

      const [files, total] = await Promise.all([
        prisma.file.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimetype: true,
            size: true,
            path: true,
            type: true,
            createdAt: true
          }
        }),
        prisma.file.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          files,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get user files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch files',
        error: error.message,
      });
    }
  }
}

module.exports = UploadController;