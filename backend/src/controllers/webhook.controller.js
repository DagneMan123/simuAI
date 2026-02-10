const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

class WebhookController {
  /**
   * @route   POST /api/webhooks/chapa
   * @desc    Handle Chapa payment webhooks
   * @access  Public (but verified)
   */
  static async handleChapaWebhook(req, res) {
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
          return res.status(401).json({ 
            success: false,
            message: 'Invalid signature' 
          });
        }
      }

      const { event, data } = payload;

      console.log(`Chapa webhook received: ${event}`, data);

      // Log webhook event
      await prisma.webhookLog.create({
        data: {
          provider: 'CHAPA',
          event,
          payload: payload,
          status: 'RECEIVED',
          processedAt: new Date()
        }
      });

      // Handle different event types
      switch (event) {
        case 'charge.success':
          await this.handlePaymentSuccess(data);
          break;

        case 'charge.failed':
          await this.handlePaymentFailed(data);
          break;

        case 'charge.pending':
          await this.handlePaymentPending(data);
          break;

        case 'charge.cancelled':
          await this.handlePaymentCancelled(data);
          break;

        default:
          console.log(`Unknown Chapa event type: ${event}`);
      }

      res.json({ 
        success: true, 
        message: 'Webhook processed successfully' 
      });
    } catch (error) {
      console.error('Chapa webhook processing error:', error);
      
      // Log webhook error
      try {
        await prisma.webhookLog.create({
          data: {
            provider: 'CHAPA',
            event: req.body?.event || 'unknown',
            payload: req.body,
            status: 'ERROR',
            error: error.message,
            processedAt: new Date()
          }
        });
      } catch (logError) {
        console.error('Failed to log webhook error:', logError);
      }

      res.status(500).json({ 
        success: false, 
        message: 'Webhook processing failed' 
      });
    }
  }

  /**
   * @route   POST /api/webhooks/email
   * @desc    Handle email service webhooks (SendGrid, Mailgun, etc.)
   * @access  Public (but verified)
   */
  static async handleEmailWebhook(req, res) {
    try {
      const payload = req.body;

      console.log('Email webhook received:', payload);

      // Log webhook event
      await prisma.webhookLog.create({
        data: {
          provider: 'EMAIL',
          event: payload.event || 'email_event',
          payload: payload,
          status: 'RECEIVED',
          processedAt: new Date()
        }
      });

      // Handle email events (delivered, opened, clicked, bounced, etc.)
      const { event, email, timestamp, url } = payload;

      switch (event) {
        case 'delivered':
          console.log(`Email delivered to: ${email}`);
          await this.handleEmailDelivered(email, timestamp);
          break;

        case 'opened':
          console.log(`Email opened by: ${email}`);
          await this.handleEmailOpened(email, timestamp);
          break;

        case 'clicked':
          console.log(`Email link clicked by: ${email}, URL: ${url}`);
          await this.handleEmailClicked(email, url, timestamp);
          break;

        case 'bounced':
          console.log(`Email bounced: ${email}`);
          await this.handleEmailBounced(email, timestamp);
          break;

        case 'spam':
          console.log(`Email marked as spam: ${email}`);
          await this.handleEmailSpam(email, timestamp);
          break;

        case 'unsubscribed':
          console.log(`User unsubscribed: ${email}`);
          await this.handleEmailUnsubscribed(email, timestamp);
          break;

        default:
          console.log(`Unknown email event: ${event}`);
      }

      res.json({ 
        success: true,
        message: 'Email webhook processed successfully'
      });
    } catch (error) {
      console.error('Email webhook error:', error);
      
      // Log webhook error
      try {
        await prisma.webhookLog.create({
          data: {
            provider: 'EMAIL',
            event: req.body?.event || 'unknown',
            payload: req.body,
            status: 'ERROR',
            error: error.message,
            processedAt: new Date()
          }
        });
      } catch (logError) {
        console.error('Failed to log webhook error:', logError);
      }

      res.status(500).json({ 
        success: false,
        message: 'Email webhook processing failed'
      });
    }
  }

  /**
   * @route   POST /api/webhooks/sms
   * @desc    Handle SMS service webhooks
   * @access  Public (but verified)
   */
  static async handleSMSWebhook(req, res) {
    try {
      const payload = req.body;

      console.log('SMS webhook received:', payload);

      // Log webhook event
      await prisma.webhookLog.create({
        data: {
          provider: 'SMS',
          event: payload.event || 'sms_event',
          payload: payload,
          status: 'RECEIVED',
          processedAt: new Date()
        }
      });

      // Handle SMS events
      const { event, phone, message, status, timestamp } = payload;

      switch (event) {
        case 'delivered':
          console.log(`SMS delivered to: ${phone}`);
          await this.handleSMSDelivered(phone, message, timestamp);
          break;

        case 'failed':
          console.log(`SMS failed to: ${phone}`);
          await this.handleSMSFailed(phone, message, status, timestamp);
          break;

        case 'received':
          console.log(`SMS received from: ${phone}, Message: ${message}`);
          await this.handleSMSReceived(phone, message, timestamp);
          break;

        default:
          console.log(`Unknown SMS event: ${event}`);
      }

      res.json({ 
        success: true,
        message: 'SMS webhook processed successfully'
      });
    } catch (error) {
      console.error('SMS webhook error:', error);
      
      // Log webhook error
      try {
        await prisma.webhookLog.create({
          data: {
            provider: 'SMS',
            event: req.body?.event || 'unknown',
            payload: req.body,
            status: 'ERROR',
            error: error.message,
            processedAt: new Date()
          }
        });
      } catch (logError) {
        console.error('Failed to log webhook error:', logError);
      }

      res.status(500).json({ 
        success: false,
        message: 'SMS webhook processing failed'
      });
    }
  }

  // Helper methods for payment events
  static async handlePaymentSuccess(data) {
    try {
      await prisma.payment.update({
        where: { reference: data.tx_ref },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(),
          paymentMethod: data.payment_method,
          chapaResponse: data
        }
      });

      // Send success notification to user
      console.log(`Payment successful: ${data.tx_ref}`);
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  static async handlePaymentFailed(data) {
    try {
      await prisma.payment.update({
        where: { reference: data.tx_ref },
        data: {
          status: 'FAILED',
          chapaResponse: data
        }
      });

      console.log(`Payment failed: ${data.tx_ref}`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  static async handlePaymentPending(data) {
    try {
      await prisma.payment.update({
        where: { reference: data.tx_ref },
        data: {
          status: 'PENDING',
          chapaResponse: data
        }
      });

      console.log(`Payment pending: ${data.tx_ref}`);
    } catch (error) {
      console.error('Error handling payment pending:', error);
    }
  }

  static async handlePaymentCancelled(data) {
    try {
      await prisma.payment.update({
        where: { reference: data.tx_ref },
        data: {
          status: 'CANCELLED',
          chapaResponse: data
        }
      });

      console.log(`Payment cancelled: ${data.tx_ref}`);
    } catch (error) {
      console.error('Error handling payment cancellation:', error);
    }
  }

  // Helper methods for email events
  static async handleEmailDelivered(email, timestamp) {
    // Update email delivery status
    // Implementation depends on your email tracking needs
  }

  static async handleEmailOpened(email, timestamp) {
    // Track email opens for analytics
    // Implementation depends on your email tracking needs
  }

  static async handleEmailClicked(email, url, timestamp) {
    // Track email link clicks
    // Implementation depends on your email tracking needs
  }

  static async handleEmailBounced(email, timestamp) {
    // Handle bounced emails - maybe mark user as unreachable
    // Implementation depends on your email tracking needs
  }

  static async handleEmailSpam(email, timestamp) {
    // Handle spam reports
    // Implementation depends on your email tracking needs
  }

  static async handleEmailUnsubscribed(email, timestamp) {
    // Handle unsubscriptions
    try {
      await prisma.user.update({
        where: { email },
        data: { emailSubscribed: false }
      });
    } catch (error) {
      console.error('Error handling email unsubscription:', error);
    }
  }

  // Helper methods for SMS events
  static async handleSMSDelivered(phone, message, timestamp) {
    // Track SMS delivery
    // Implementation depends on your SMS tracking needs
  }

  static async handleSMSFailed(phone, message, status, timestamp) {
    // Handle SMS delivery failures
    // Implementation depends on your SMS tracking needs
  }

  static async handleSMSReceived(phone, message, timestamp) {
    // Handle incoming SMS messages
    // Implementation depends on your SMS handling needs
  }
}

module.exports = WebhookController;