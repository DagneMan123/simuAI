const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const axios = require('axios');
const crypto = require('crypto');

const prisma = new PrismaClient();

class PaymentController {
  /**
   * @route   POST /api/payment/initialize
   * @desc    Initialize Chapa payment
   * @access  Private (Employer/Admin)
   */
  static async initializePayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { amount, currency = 'ETB', simulationId, description } = req.body;
      const userId = req.user.id;

      // Generate unique transaction reference
      const txRef = `SIMUAI-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

      // Prepare payment data
      const paymentData = {
        amount: amount.toString(),
        currency,
        email: req.user.email,
        first_name: req.user.firstName || 'User',
        last_name: req.user.lastName || 'Name',
        tx_ref: txRef,
        callback_url: `${process.env.BACKEND_URL}/api/payment/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment/success?ref=${txRef}`,
        customization: {
          title: 'SimuAI - Talent Assessment Platform',
          description: description || 'Payment for assessment services',
          logo: `${process.env.FRONTEND_URL}/logo.png`,
        },
      };

      // Call Chapa API
      const response = await axios.post(
        `${process.env.CHAPA_BASE_URL}/transaction/initialize`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Save payment record to database
      await prisma.payment.create({
        data: {
          userId,
          simulationId,
          amount: parseFloat(amount),
          currency,
          reference: txRef,
          status: 'PENDING',
          description: description || 'Assessment payment'
        },
      });

      res.json({
        success: true,
        checkoutUrl: response.data.data.checkout_url,
        reference: txRef,
        message: 'Payment initialized successfully',
      });
    } catch (error) {
      console.error('Payment initialization error:', error.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment',
        error: error.response?.data?.message || error.message,
      });
    }
  }

  /**
   * @route   GET /api/payment/verify/:reference
   * @desc    Verify Chapa payment
   * @access  Private
   */
  static async verifyPayment(req, res) {
    try {
      const { reference } = req.params;

      // Verify payment with Chapa
      const response = await axios.get(
        `${process.env.CHAPA_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        }
      );

      const paymentData = response.data.data;

      // Update payment status in database
      await prisma.payment.update({
        where: { reference },
        data: {
          status: paymentData.status === 'success' ? 'SUCCESS' : 'FAILED',
          paidAt: paymentData.status === 'success' ? new Date() : null,
          paymentMethod: paymentData.payment_method,
          chapaResponse: paymentData
        },
      });

      res.json({
        success: true,
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference: paymentData.tx_ref,
        paidAt: paymentData.created_at,
        paymentMethod: paymentData.payment_method,
      });
    } catch (error) {
      console.error('Payment verification error:', error.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.response?.data?.message || error.message,
      });
    }
  }

  /**
   * @route   POST /api/payment/callback
   * @desc    Chapa webhook callback
   * @access  Public (but verified)
   */
  static async paymentCallback(req, res) {
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
          return res.status(401).json({ message: 'Invalid signature' });
        }
      }

      const { event, data } = payload;

      console.log(`Chapa webhook received: ${event}`, data);

      if (event === 'charge.success') {
        // Update payment status
        await prisma.payment.update({
          where: { reference: data.tx_ref },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            paymentMethod: data.payment_method,
            chapaResponse: data
          },
        });

        // Send notification to user
        console.log(`Payment successful: ${data.tx_ref}`);
      } else if (event === 'charge.failed') {
        // Update payment status
        await prisma.payment.update({
          where: { reference: data.tx_ref },
          data: {
            status: 'FAILED',
            chapaResponse: data
          },
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  }

  /**
   * @route   GET /api/payment/history
   * @desc    Get payment history
   * @access  Private
   */
  static async getPaymentHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      const where = { userId };
      if (status) where.status = status;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit),
          include: {
            simulation: {
              select: {
                title: true
              }
            }
          }
        }),
        prisma.payment.count({ where })
      ]);

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment history',
      });
    }
  }

  /**
   * @route   GET /api/payment/subscription-plans
   * @desc    Get available subscription plans
   * @access  Public
   */
  static async getSubscriptionPlans(req, res) {
    try {
      const plans = [
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for small teams',
          price: 99,
          currency: 'ETB',
          interval: 'monthly',
          features: [
            'Up to 50 assessments/month',
            'Basic AI evaluation',
            'Email support',
            'Standard templates',
            'Basic analytics',
          ],
          isPopular: false,
        },
        {
          id: 'professional',
          name: 'Professional',
          description: 'For growing businesses',
          price: 299,
          currency: 'ETB',
          interval: 'monthly',
          features: [
            'Up to 200 assessments/month',
            'Advanced AI evaluation',
            'Priority support',
            'Custom templates',
            'Advanced analytics',
            'API access',
            'Team collaboration',
          ],
          isPopular: true,
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'For large organizations',
          price: 999,
          currency: 'ETB',
          interval: 'monthly',
          features: [
            'Unlimited assessments',
            'Premium AI models',
            '24/7 dedicated support',
            'White-label solution',
            'Custom integrations',
            'Advanced security',
            'SLA guarantee',
          ],
          isPopular: false,
        },
      ];

      res.json({ 
        success: true, 
        data: { plans } 
      });
    } catch (error) {
      console.error('Get subscription plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription plans',
      });
    }
  }
}

module.exports = PaymentController;