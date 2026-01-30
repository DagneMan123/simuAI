const axios = require('axios');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PaymentService {
  constructor() {
    this.chapaBaseUrl = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';
    this.chapaSecretKey = process.env.CHAPA_SECRET_KEY;
    this.webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
  }

  // Initialize payment for a job posting
  static async initializePayment(employerId, jobId, amount, currency = 'ETB') {
    try {
      // Generate unique reference
      const txRef = `ai-hire-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      
      const paymentData = {
        amount: amount.toString(),
        currency,
        email: (await prisma.employerProfile.findUnique({
          where: { userId: employerId },
          select: { companyEmail: true }
        })).companyEmail,
        tx_ref: txRef,
        callback_url: `${process.env.BACKEND_URL}/api/payment/verify/${txRef}`,
        return_url: `${process.env.FRONTEND_URL}/employer/jobs/${jobId}/payment-success`,
        customization: {
          title: 'AI-Hire Job Posting',
          description: `Payment for job posting: ${jobId}`,
        },
      };

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          employerId,
          jobId,
          amount,
          currency,
          chapaReference: txRef,
          status: 'PENDING',
        },
      });

      // Update job status to UNPAID
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'UNPAID' },
      });

      // Make request to Chapa
      const response = await axios.post(
        `${this.chapaBaseUrl}/transaction/initialize`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${this.chapaSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        paymentId: payment.id,
        checkoutUrl: response.data.data.checkout_url,
        reference: txRef,
        status: 'PENDING',
      };
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  // Verify payment
  static async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${this.chapaBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaSecretKey}`,
          },
        }
      );

      const paymentData = response.data.data;

      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { chapaReference: reference },
        include: { job: true },
      });

      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentData.status === 'success' ? 'SUCCESS' : 'FAILED',
          paymentMethod: paymentData.payment_type,
          webhookData: paymentData,
        },
      });

      // If payment successful, activate job
      if (paymentData.status === 'success') {
        await prisma.job.update({
          where: { id: payment.jobId },
          data: {
            status: 'ACTIVE',
            postedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        // Create notification for employer
        await prisma.notification.create({
          data: {
            userId: payment.employerId,
            type: 'PAYMENT_SUCCESS',
            title: 'Payment Successful',
            message: `Your payment for job "${payment.job.title}" has been processed successfully. The job is now active.`,
            actionUrl: `/employer/jobs/${payment.jobId}`,
          },
        });
      }

      return updatedPayment;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  // Handle Chapa webhook
  static async handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }

      const { event, data } = payload;

      if (event === 'charge.success') {
        await this.verifyPayment(data.tx_ref);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw new Error('Failed to process webhook');
    }
  }

  // Get payment history for employer
  static async getPaymentHistory(employerId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where: { employerId },
          include: {
            job: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.payment.count({
          where: { employerId },
        }),
      ]);

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Get payment history error:', error);
      throw new Error('Failed to fetch payment history');
    }
  }
}

module.exports = PaymentService;