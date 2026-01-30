const express = require('express');
const router = express.Router();
const multer = require('multer');
const AIController = require('../controllers/ai.controller');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/interviews/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `interview-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video/audio files are allowed'), false);
    }
  },
});

// AI Evaluation routes
router.post('/transcribe', upload.single('file'), AIController.transcribeInterview);
router.post('/evaluate/:applicationId', AIController.evaluateResponse);
router.get('/rank/:jobId', AIController.rankCandidates);
router.get('/feedback/:applicationId', AIController.generateFeedback);
router.post('/analyze-resume', upload.single('resume'), AIController.analyzeResume);

module.exports = router;