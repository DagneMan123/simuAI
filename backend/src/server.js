const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Import middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { authenticate } = require('./middleware/auth.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const employerRoutes = require('./routes/employer.routes');
const candidateRoutes = require('./routes/candidate.routes');
const jobRoutes = require('./routes/job.routes');
const aiRoutes = require('./routes/ai.routes');
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');
const uploadRoutes = require('./routes/upload.routes');

// Initialize express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join room based on user ID
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle video interview events
  socket.on('interview-start', (data) => {
    socket.to(`user-${data.candidateId}`).emit('interview-started', data);
  });
  
  socket.on('interview-response', (data) => {
    socket.to(`user-${data.applicationId}`).emit('response-received', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes
app.set('io', io);

// ==================== MIDDLEWARE SETUP ====================
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// ==================== ROUTES ====================
// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: 'Connected'
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'AI-Hire API Documentation',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      employer: '/api/employer',
      candidate: '/api/candidate',
      jobs: '/api/jobs',
      ai: '/api/ai',
      payment: '/api/payment',
      upload: '/api/upload'
    }
  });
});

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticate(['ADMIN']), adminRoutes);
app.use('/api/employer', authenticate(['EMPLOYER', 'ADMIN']), employerRoutes);
app.use('/api/candidate', authenticate(['CANDIDATE', 'ADMIN']), candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', authenticate(['EMPLOYER', 'CANDIDATE', 'ADMIN']), aiRoutes);
app.use('/api/payment', authenticate(['EMPLOYER', 'ADMIN']), paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/upload', authenticate(['EMPLOYER', 'CANDIDATE', 'ADMIN']), uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
   AI-Hire Backend Server Started!
  ===================================
   Port: ${PORT}
   Environment: ${process.env.NODE_ENV}
    Database: PostgreSQL (Connected)
   API: http://localhost:${PORT}/api
   Docs: http://localhost:${PORT}/api/docs
   WebSocket: Ready
  ===================================
  `);
});

module.exports = { app, server, prisma };