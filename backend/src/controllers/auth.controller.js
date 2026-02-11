const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

class AuthController {
  // Unified Login
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Note: Session tracking removed as Session model doesn't exist in schema

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      // Prepare response - User model already has firstName, lastName, company
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        company: user.company || null,
      };

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        tokens: {
          accessToken: token,
          refreshToken: token, // Using same token for now
        },
        user: userData,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Toggle-based Registration
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role, firstName, lastName, company } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user - User model has firstName, lastName, company directly
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          company: role === 'EMPLOYER' ? company : null,
          isVerified: false, // Email verification can be added later
        },
      });

      // Generate token
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      // Prepare user data for response
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
      };

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        tokens: {
          accessToken: token,
          refreshToken: token, // Using same token for now
        },
        user: userData,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Verify Email (Simplified - no verification token in schema)
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // For now, just return success
      // Email verification can be implemented when needed
      res.status(200).json({
        success: true,
        message: 'Email verification not implemented yet',
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
      });
    }
  }

  // Forgot Password (Simplified - no reset token in schema)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Password reset can be implemented when needed
      res.status(200).json({
        success: true,
        message: 'Password reset not implemented yet',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request',
      });
    }
  }

  // Reset Password (Simplified)
  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      // Password reset can be implemented when needed
      res.status(200).json({
        success: true,
        message: 'Password reset not implemented yet',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed',
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }

  // Get Current User
  static async getCurrentUser(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        createdAt: user.createdAt,
      };

      res.status(200).json({
        success: true,
        user: userData,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user data',
      });
    }
  }

}

module.exports = AuthController;