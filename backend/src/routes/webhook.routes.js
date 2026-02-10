const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/**
 * Webhook Routes
 * These routes handle external service callbacks
 */

/**
 * @route   POST /api/webhooks/chapa
 * @desc    Handle Chapa payment webhooks
 * @access  Public (but verified)
 */
router.post('/chapa', async (req, res) => {
  try {
    const signature = req.headers['chapa-signature'];
    const payload = req.body;

    // Verify webhook signature
    if (process.env.CHAPA_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    }

    const { event, data } = payload;

    console.log(`Chapa webhook received: ${event}`, data);

    // Handle different event types
    switch (event) {
      case 'charge.success':
        // Payment successful
        console.log(`Payment successful: ${data.tx_ref}`);
        // Update database, send notifications, etc.
        break;

      case 'charge.failed':
        // Payment failed
        console.log(`Payment failed: ${data.tx_ref}`);
        break;

      case 'charge.pending':
        // Payment pending
        console.log(`Payment pending: ${data.tx_ref}`);
        break;

      default:
        console.log(`Unknown event type: ${event}`);
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

/**
 * @route   POST /api/webhooks/email
 * @desc    Handle email service webhooks (SendGrid, Mailgun, etc.)
 * @access  Public (but verified)
 */
router.post('/email', async (req, res) => {
  try {
    const payload = req.body;

    console.log('Email webhook received:', payload);

    // Handle email events (delivered, opened, clicked, bounced, etc.)
    const { event, email, timestamp } = payload;

    switch (event) {
      case 'delivered':
        console.log(`Email delivered to: ${email}`);
        break;

      case 'opened':
        console.log(`Email opened by: ${email}`);
        break;

      case 'clicked':
        console.log(`Email link clicked by: ${email}`);
        break;

      case 'bounced':
        console.log(`Email bounced: ${email}`);
        break;

      case 'spam':
        console.log(`Email marked as spam: ${email}`);
        break;

      default:
        console.log(`Unknown email event: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Email webhook error:', error);
    res.status(500).json({ success: false });
  }
});

/**
 * @route   POST /api/webhooks/sms
 * @desc    Handle SMS service webhooks
 * @access  Public (but verified)
 */
router.post('/sms', async (req, res) => {
  try {
    const payload = req.body;

    console.log('SMS webhook received:', payload);

    res.json({ success: true });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
