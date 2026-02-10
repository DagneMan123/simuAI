const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided. Authorization denied.',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
      }

      // Attach user to request
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Authorization denied.',
        });
      }

      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed.',
      });
    }
  };
};

/**
 * Optional Authentication
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required.',
    });
  }
};

/**
 * Check if user is employer
 */
const isEmployer = (req, res, next) => {
  if (req.user && (req.user.role === 'EMPLOYER' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Employer access required.',
    });
  }
};

/**
 * Check if user is candidate
 */
const isCandidate = (req, res, next) => {
  if (req.user && (req.user.role === 'CANDIDATE' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Candidate access required.',
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  isAdmin,
  isEmployer,
  isCandidate,
};
