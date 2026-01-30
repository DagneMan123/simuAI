const express = require('express');
const router = express.Router();
const JobController = require('../controllers/job.controller');

// Public routes
router.get('/public', JobController.getPublicJobs);
router.get('/public/:id', JobController.getJobById);

// Protected routes
router.get('/', JobController.getJobs);
router.get('/:id', JobController.getJobDetails);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);
router.get('/:id/applications', JobController.getJobApplications);
router.get('/:id/ai-questions', JobController.getAIQuestions);
router.post('/:id/generate-questions', JobController.generateAIQuestions);

module.exports = router;