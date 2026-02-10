const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhook.controller');

// Routes - All 3 Webhook Endpoints
router.post('/chapa', WebhookController.handleChapaWebhook);
router.post('/email', WebhookController.handleEmailWebhook);
router.post('/sms', WebhookController.handleSMSWebhook);

module.exports = router;
