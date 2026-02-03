import api from './api';

export interface PaymentInitiation {
  amount: number;
  currency?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  reference?: string;
  callbackUrl?: string;
  returnUrl?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface PaymentResponse {
  checkoutUrl: string;
  transactionId: string;
  reference: string;
  status: 'created' | 'pending' | 'success' | 'failed';
  message: string;
}

export interface PaymentVerification {
  status: 'success' | 'failed' | 'pending' | 'expired';
  transactionId: string;
  amount: number;
  currency: string;
  reference: string;
  paidAt?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  paymentMethod?: string;
  fee?: number;
}

export interface PaymentHistory {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  paidAt?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
}

export const payService = {
  // የመጀመሪያ ክፍያ
  async initiatePayment(data: PaymentInitiation): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payment/initiate', {
        ...data,
        currency: data.currency || 'ETB',
        callbackUrl: data.callbackUrl || `${window.location.origin}/payment-callback`,
        returnUrl: data.returnUrl || `${window.location.origin}/payment-success`,
      });
      return response.data;
    } catch (error) {
      console.error('Initiate payment error:', error);
      throw error;
    }
  },

  // ክፍያ ማረጋገጫ
  async verifyPayment(reference: string): Promise<PaymentVerification> {
    try {
      const response = await api.get(`/payment/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  // የክፍያ ታሪክ
  async getPaymentHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{ payments: PaymentHistory[]; total: number; page: number }> {
    try {
      const response = await api.get('/payment/history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  },

  // የደንበኝነት አቅም ማግኘት
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await api.get('/payment/subscription-plans');
      return response.data;
    } catch (error) {
      console.error('Get subscription plans error:', error);
      throw error;
    }
  },

  // ደንበኝነት መጀመር
  async subscribeToPlan(
    planId: string,
    paymentMethod: 'card' | 'mobile_money' | 'bank'
  ): Promise<{ subscriptionId: string; paymentUrl?: string }> {
    try {
      const response = await api.post('/payment/subscribe', {
        planId,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      console.error('Subscribe to plan error:', error);
      throw error;
    }
  },

  // የደንበኛ ዝርዝር
  async getSubscriptions(): Promise<Array<{
    id: string;
    plan: SubscriptionPlan;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  }>> {
    try {
      const response = await api.get('/payment/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Get subscriptions error:', error);
      throw error;
    }
  },

  // ደንበኝነት ማቋረጥ
  async cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
    try {
      const response = await api.post(`/payment/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  },

  // ደንበኝነት መቤዠት
  async updateSubscription(
    subscriptionId: string,
    newPlanId: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.put(`/payment/subscriptions/${subscriptionId}`, {
        newPlanId,
      });
      return response.data;
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  },

  // የChapa JavaScript SDK ማስጀመር
  initializeChapa(): void {
    const chapaPublicKey = import.meta.env.VITE_CHAPA_PUBLIC_KEY;
    
    if (!chapaPublicKey) {
      console.error('Chapa public key is not defined');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.chapa.co/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Chapa SDK loaded');
    };
    
    script.onerror = () => {
      console.error('Failed to load Chapa SDK');
    };
    
    document.head.appendChild(script);
  },

  // በቀጥታ Chapa SDK መጠቀም
  async payWithChapaSDK(
    data: PaymentInitiation & {
      publicKey: string;
      onClose?: () => void;
      onSuccess?: (response: any) => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // @ts-ignore - Chapa SDK እንዳለ መገመት
      if (typeof window.Chapa === 'undefined') {
        reject(new Error('Chapa SDK not loaded'));
        return;
      }

      // @ts-ignore
      window.Chapa.setup({
        publicKey: data.publicKey,
        amount: data.amount,
        currency: data.currency || 'ETB',
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || '',
        tx_ref: data.reference || `tx-${Date.now()}`,
        customization: {
          title: data.customization?.title || 'Skill Assessment Platform',
          description: data.customization?.description || 'Payment for assessment services',
          logo: data.customization?.logo || 'https://your-logo-url.com/logo.png',
        },
        callback: (response: any) => {
          if (response.status === 'successful') {
            data.onSuccess?.(response);
            resolve();
          } else {
            const error = new Error(response.message || 'Payment failed');
            data.onError?.(error);
            reject(error);
          }
        },
        onClose: () => {
          data.onClose?.();
          reject(new Error('Payment cancelled by user'));
        },
      });
    });
  },

  // የሚደግፉ የክፍያ ዘዴዎች
  getSupportedPaymentMethods(): Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    countries: string[];
  }> {
    return [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        icon: '📱',
        description: 'Pay with mobile money (M-Pesa, Telebirr, etc.)',
        countries: ['ET', 'KE', 'TZ', 'UG'],
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Pay with Visa, Mastercard, or American Express',
        countries: ['ET', 'KE', 'TZ', 'UG', 'Global'],
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        icon: '🏦',
        description: 'Direct bank transfer',
        countries: ['ET', 'KE', 'TZ', 'UG'],
      },
    ];
  },

  // የክፍያ አማራጭ ማግኘት በአገር
  getPaymentMethodsByCountry(countryCode: string) {
    return this.getSupportedPaymentMethods().filter(method =>
      method.countries.includes(countryCode) || method.countries.includes('Global')
    );
  },

  // የክፍያ ዋጋን መጠቀም በአገር
  formatCurrency(amount: number, currency: string = 'ETB'): string {
    const formatter = new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  },

  // የክፍያ ምስክር ወረቀት ማግኘት
  async getReceipt(transactionId: string): Promise<{ pdfUrl: string }> {
    try {
      const response = await api.get(`/payment/receipt/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Get receipt error:', error);
      throw error;
    }
  },

  // የክፍያ ማጣሪያ
  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<{ message: string; refundId: string }> {
    try {
      const response = await api.post(`/payment/refund/${transactionId}`, {
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  },
};