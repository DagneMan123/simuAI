const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const AIController = require('../controllers/ai.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Validation middleware
const evaluateValidation = [
  body('submission').notEmpty().withMessage('Submission is required'),
  body('rubric').optional().isObject().withMessage('Rubric must be an object')
];

const generateQuestionsValidation = [
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')
];

const careerAdviceValidation = [
  body('skills').isArray().withMessage('Skills must be an array'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('goals').notEmpty().withMessage('Goals are required')
];

const chatValidation = [
  body('query').notEmpty().withMessage('Query is required')
];

const feedbackValidation = [
  body('question').notEmpty().withMessage('Question is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('questionType').optional().isIn(['TECHNICAL', 'BEHAVIORAL', 'SITUATIONAL']).withMessage('Invalid question type')
];

// Routes - All 8 AI Endpoints
router.post('/evaluate', evaluateValidation, AIController.evaluateSubmission);
router.post('/generate-questions', generateQuestionsValidation, AIController.generateQuestions);
router.post('/career-advice', careerAdviceValidation, AIController.getCareerAdvice);
router.post('/analyze-interview', upload.single('audio'), AIController.analyzeInterview);
router.post('/chat', chatValidation, AIController.chatWithAI);
router.post('/feedback', feedbackValidation, AIController.getFeedback);
router.post('/analyze-image', upload.single('image'), AIController.analyzeImage);
router.post('/speech-to-text', upload.single('audio'), AIController.speechToText);

module.exports = router;
