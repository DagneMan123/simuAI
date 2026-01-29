const prisma = require('../../config/database');

const candidateOnly = async (req, res, next) => {
  if (req.user.role !== 'CANDIDATE') {
    return res.status(403).json({ 
      error: 'This route is accessible only to candidates.' 
    });
  }
  
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found.' });
    }
    
    req.candidate = candidate;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const employerOnly = async (req, res, next) => {
  if (req.user.role !== 'EMPLOYER') {
    return res.status(403).json({ 
      error: 'This route is accessible only to employers.' 
    });
  }
  
  try {
    const employer = await prisma.employer.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer profile not found.' });
    }
    
    req.employer = employer;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'This route is accessible only to administrators.' 
    });
  }
  
  next();
};

module.exports = { candidateOnly, employerOnly, adminOnly };