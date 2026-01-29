const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }
    
    // Check if session is valid
    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        token: token,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!session) {
      return res.status(401).json({ error: 'Session expired.' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to access this resource.' 
      });
    }
    
    next();
  };
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({ errors });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize, validate };