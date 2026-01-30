const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
        include: {
          adminProfile: true,
          employerProfile: true,
          candidateProfile: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
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

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Create session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: crypto.randomBytes(32).toString('hex'),
          deviceInfo: req.headers['user-agent'],
          ipAddress: req.ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
          email: user.email,
          sessionId: session.id,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      // Prepare response based on role
      let userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      };

      switch (user.role) {
        case 'ADMIN':
          userData.profile = user.adminProfile;
          break;
        case 'EMPLOYER':
          userData.profile = user.employerProfile;
          break;
        case 'CANDIDATE':
          userData.profile = user.candidateProfile;
          break;
      }

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
        token,
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

      const { email, password, role, ...profileData } = req.body;

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

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create user transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            verificationToken,
          },
        });

        // Create role-specific profile
        let profile;
        switch (role) {
          case 'ADMIN':
            profile = await prisma.adminProfile.create({
              data: {
                userId: user.id,
                fullName: profileData.fullName || '',
                phoneNumber: profileData.phoneNumber || '',
              },
            });
            break;

          case 'EMPLOYER':
            profile = await prisma.employerProfile.create({
              data: {
                userId: user.id,
                companyName: profileData.companyName,
                companyEmail: profileData.companyEmail || email,
                phoneNumber: profileData.phoneNumber,
                companyLocation: profileData.companyLocation || '',
                industry: profileData.industry || '',
              },
            });
            break;

          case 'CANDIDATE':
            profile = await prisma.candidateProfile.create({
              data: {
                userId: user.id,
                fullName: profileData.fullName,
                phoneNumber: profileData.phoneNumber || '',
                location: profileData.location || '',
                title: profileData.title || '',
                skills: profileData.skills || [],
              },
            });
            break;
        }

        return { user, profile };
      });

      // Send verification email
      await this.sendVerificationEmail(email, verificationToken);

      // Generate token
      const token = jwt.sign(
        {
          userId: result.user.id,
          role: result.user.role,
          email: result.user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          profile: result.profile,
        },
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

  // Verify Email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token',
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
      });
    }
  }

  // Forgot Password
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

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send reset email
      await this.sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process request',
      });
    }
  }

  // Reset Password
  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successful',
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
      const { sessionId } = req.user;

      if (sessionId) {
        await prisma.session.update({
          where: { id: sessionId },
          data: { isValid: false },
        });
      }

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
        include: {
          adminProfile: true,
          employerProfile: true,
          candidateProfile: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      let userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      };

      switch (user.role) {
        case 'ADMIN':
          userData.profile = user.adminProfile;
          break;
        case 'EMPLOYER':
          userData.profile = user.employerProfile;
          break;
        case 'CANDIDATE':
          userData.profile = user.candidateProfile;
          break;
      }

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

  // Email sending helper methods
  static async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `"AI-Hire" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - AI-Hire',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to AI-Hire!</h2>
          <p>Thank you for registering. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"AI-Hire" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Reset Your Password - AI-Hire',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = AuthController;