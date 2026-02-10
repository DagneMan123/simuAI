# Chapa Payment & AI Integration Guide

This guide will help you set up Chapa payment integration and AI services for SimuAI.

## 📋 Table of Contents
1. [Chapa Payment Integration](#chapa-payment-integration)
2. [AI Service Integration](#ai-service-integration)
3. [Testing](#testing)
4. [Troubleshooting](#troubleshooting)

---

## 💳 Chapa Payment Integration

### Step 1: Get Chapa API Keys

1. **Sign up for Chapa**
   - Visit [https://chapa.co](https://chapa.co)
   - Create an account
   - Complete business verification

2. **Get API Keys**
   - Go to Dashboard → Settings → API Keys
   - Copy your **Secret Key** and **Public Key**
   - For testing, use **Test Mode** keys

### Step 2: Configure Environment Variables

Update `backend/.env`:
```env
CHAPA_SECRET_KEY="CHASECK_TEST-xxxxxxxxxxxxxxxxxx"
CHAPA_PUBLIC_KEY="CHAPUBK_TEST-xxxxxxxxxxxxxxxxxx"
CHAPA_BASE_URL="https://api.chapa.co/v1"
CHAPA_WEBHOOK_SECRET="your-webhook-secret-key"
BACKEND_URL="http://localhost:5000"
```

Update `frontend/.env`:
```env
VITE_CHAPA_PUBLIC_KEY="CHAPUBK_TEST-xxxxxxxxxxxxxxxxxx"
```

### Step 3: Test Payment Flow

1. **Initialize Payment**
```javascript
// Frontend
import { payService } from '@/lib/payService';

const handlePayment = async () => {
  try {
    const response = await payService.initiatePayment({
      amount: 500,
      currency: 'ETB',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+251911234567',
      customization: {
        title: 'Premium Assessment',
        description: 'Payment for premium assessment package',
      },
    });
    
    // Redirect to Chapa checkout
    window.location.href = response.checkoutUrl;
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

2. **Verify Payment**
```javascript
// After payment, verify on callback
const verifyPayment = async (reference) => {
  try {
    const result = await payService.verifyPayment(reference);
    if (result.status === 'success') {
      console.log('Payment successful!');
      // Update UI, grant access, etc.
    }
  } catch (error) {
    console.error('Verification error:', error);
  }
};
```

### Step 4: Setup Webhook (Production)

1. **Configure Webhook URL**
   - In Chapa Dashboard → Settings → Webhooks
   - Add: `https://yourdomain.com/api/payment/callback`

2. **Generate Webhook Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Test Webhook Locally**
```bash
# Use ngrok for local testing
ngrok http 5000

# Update webhook URL in Chapa dashboard
https://your-ngrok-url.ngrok.io/api/payment/callback
```

### Supported Payment Methods

Chapa supports:
- 💳 **Credit/Debit Cards** (Visa, Mastercard)
- 📱 **Mobile Money** (Telebirr, M-Pesa, etc.)
- 🏦 **Bank Transfer**

### Test Cards

For testing in Test Mode:
```
Card Number: 4200 0000 0000 0000
CVV: 123
Expiry: Any future date
```

---

## 🤖 AI Service Integration

### Option 1: Groq (Recommended - Free & Fast)

1. **Get Groq API Key**
   - Visit [https://console.groq.com](https://console.groq.com)
   - Sign up for free account
   - Go to API Keys → Create New Key
   - Copy the key

2. **Configure**
```env
# backend/.env
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

3. **Features**
   - ✅ Free tier with generous limits
   - ✅ Very fast inference
   - ✅ Mixtral 8x7B model
   - ✅ No credit card required

### Option 2: OpenAI

1. **Get OpenAI API Key**
   - Visit [https://platform.openai.com](https://platform.openai.com)
   - Create account and add payment method
   - Go to API Keys → Create New Key

2. **Configure**
```env
# backend/.env
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

3. **Pricing**
   - GPT-3.5-Turbo: $0.0015 per 1K tokens
   - GPT-4: $0.03 per 1K tokens

### Option 3: Anthropic Claude

1. **Get Anthropic API Key**
   - Visit [https://console.anthropic.com](https://console.anthropic.com)
   - Sign up and get API key

2. **Configure**
```env
# backend/.env
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### AI Features Available

1. **Question Generation**
```javascript
// Generate interview questions
const questions = await aiApi.generateSimulationQuestions(
  'Software Engineer',
  'medium'
);
```

2. **Answer Evaluation**
```javascript
// Evaluate candidate submission
const evaluation = await aiApi.evaluate({
  submission: candidateAnswer,
  rubric: evaluationCriteria,
  expectedOutput: sampleAnswer,
});
```

3. **Career Advice**
```javascript
// Get personalized career advice
const advice = await aiApi.getCareerAdvice({
  skills: ['JavaScript', 'React', 'Node.js'],
  experience: '2 years',
  goals: 'Senior Developer',
});
```

4. **Interview Analysis**
```javascript
// Analyze mock interview
const analysis = await aiApi.analyzeMockInterview(audioBlob);
```

5. **AI Chatbot**
```javascript
// Ask AI questions
const response = await aiApi.chat({
  query: 'How can I improve my coding skills?',
  context: 'I am a junior developer',
});
```

---

## 🧪 Testing

### Test Payment Integration

1. **Start Backend**
```bash
cd backend
npm run dev
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

3. **Test Payment Flow**
   - Navigate to pricing page
   - Click "Get Started" on any plan
   - Fill in test card details
   - Complete payment
   - Verify success callback

### Test AI Integration

1. **Test Question Generation**
```bash
curl -X POST http://localhost:5000/api/ai/generate-questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobTitle": "Software Engineer",
    "difficulty": "medium",
    "count": 5
  }'
```

2. **Test Evaluation**
```bash
curl -X POST http://localhost:5000/api/ai/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "submission": "My answer here...",
    "rubric": {"criteria": "Technical accuracy"},
    "expectedOutput": "Expected answer..."
  }'
```

3. **Test Chat**
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "How do I prepare for a technical interview?"
  }'
```

---

## 🔧 Troubleshooting

### Chapa Issues

**Problem: Payment initialization fails**
```
Solution:
1. Check API keys are correct
2. Verify CHAPA_BASE_URL is set
3. Check amount is valid (minimum 1 ETB)
4. Ensure email format is valid
```

**Problem: Webhook not receiving events**
```
Solution:
1. Verify webhook URL is publicly accessible
2. Check webhook secret matches
3. Test with ngrok for local development
4. Check Chapa dashboard for webhook logs
```

**Problem: Payment verification fails**
```
Solution:
1. Wait a few seconds after payment
2. Check reference format is correct
3. Verify secret key has verification permissions
4. Check Chapa API status
```

### AI Issues

**Problem: AI API returns 401 Unauthorized**
```
Solution:
1. Verify API key is correct
2. Check key has not expired
3. Ensure key is properly set in .env
4. Restart backend server after changing .env
```

**Problem: AI responses are slow**
```
Solution:
1. Use Groq for faster responses
2. Reduce max_tokens parameter
3. Implement caching for common queries
4. Use streaming responses
```

**Problem: AI returns invalid JSON**
```
Solution:
1. Add JSON validation in prompt
2. Use try-catch with fallback
3. Implement retry logic
4. Log raw responses for debugging
```

### General Issues

**Problem: CORS errors**
```
Solution:
1. Check FRONTEND_URL in backend .env
2. Verify CORS middleware is configured
3. Check browser console for specific error
4. Ensure credentials are included in requests
```

**Problem: Environment variables not loading**
```
Solution:
1. Restart development server
2. Check .env file location
3. Verify variable names match exactly
4. Use dotenv package correctly
```

---

## 📚 Additional Resources

### Chapa Documentation
- [Chapa API Docs](https://developer.chapa.co/docs)
- [Chapa Dashboard](https://dashboard.chapa.co)
- [Chapa Support](mailto:support@chapa.co)

### AI Service Documentation
- [Groq Documentation](https://console.groq.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com)

### Support
For issues or questions:
- Email: support@simuai.com
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

---

## 🚀 Production Checklist

Before going live:

### Chapa
- [ ] Switch to production API keys
- [ ] Configure production webhook URL
- [ ] Test with real payment methods
- [ ] Set up payment monitoring
- [ ] Configure refund policies
- [ ] Add payment receipt generation

### AI
- [ ] Set up production API keys
- [ ] Implement rate limiting
- [ ] Add response caching
- [ ] Monitor token usage
- [ ] Set up error tracking
- [ ] Implement fallback mechanisms

### Security
- [ ] Enable HTTPS
- [ ] Implement request signing
- [ ] Add input validation
- [ ] Set up logging
- [ ] Configure firewall rules
- [ ] Regular security audits

---

**Last Updated:** February 2026
**Version:** 1.0.0
