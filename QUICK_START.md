# 🚀 Quick Start Guide - Chapa & AI Integration

## ⚡ 5-Minute Setup

### 1. Get API Keys (Choose One AI Service)

#### Option A: Groq (Recommended - Free & Fast)
```bash
# Visit: https://console.groq.com
# Sign up → API Keys → Create New Key
# Copy: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option B: OpenAI
```bash
# Visit: https://platform.openai.com
# Sign up → API Keys → Create New Key
# Copy: sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Chapa Payment
```bash
# Visit: https://dashboard.chapa.co
# Sign up → Settings → API Keys
# Copy both Secret and Public keys
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
# AI Service (choose one)
GROQ_API_KEY="gsk_your_key_here"
# OR
OPENAI_API_KEY="sk_your_key_here"

# Chapa Payment
CHAPA_SECRET_KEY="CHASECK_TEST-your_key_here"
CHAPA_PUBLIC_KEY="CHAPUBK_TEST-your_key_here"
CHAPA_BASE_URL="https://api.chapa.co/v1"
CHAPA_WEBHOOK_SECRET="your_webhook_secret"

# URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
```

**Frontend** (`frontend/.env`):
```env
VITE_CHAPA_PUBLIC_KEY="CHAPUBK_TEST-your_key_here"
```

### 3. Install & Run

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Test integrations
cd backend && npm run test:integrations

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

### 4. Test Features

#### Test Payment
```javascript
// In your React component
import { payService } from '@/lib/payService';

const handlePayment = async () => {
  const response = await payService.initiatePayment({
    amount: 100,
    currency: 'ETB',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  });
  window.location.href = response.checkoutUrl;
};
```

#### Test AI
```javascript
// In your React component
import { aiApi } from '@/lib/api';

const generateQuestions = async () => {
  const questions = await aiApi.generateSimulationQuestions(
    'Software Engineer',
    'medium'
  );
  console.log(questions);
};
```

---

## 📚 API Quick Reference

### Payment Endpoints

```bash
# Initialize payment
POST /api/payment/initialize
{
  "amount": 500,
  "currency": "ETB",
  "simulationId": "sim_123"
}

# Verify payment
GET /api/payment/verify/:reference

# Get payment history
GET /api/payment/history?page=1&limit=10

# Get subscription plans
GET /api/payment/subscription-plans
```

### AI Endpoints

```bash
# Generate questions
POST /api/ai/generate-questions
{
  "jobTitle": "Software Engineer",
  "difficulty": "medium",
  "count": 5
}

# Evaluate submission
POST /api/ai/evaluate
{
  "submission": "candidate answer",
  "rubric": {"criteria": "accuracy"},
  "expectedOutput": "expected answer"
}

# Get career advice
POST /api/ai/career-advice
{
  "skills": ["JavaScript", "React"],
  "experience": "2 years",
  "goals": "Senior Developer"
}

# AI Chat
POST /api/ai/chat
{
  "query": "How to prepare for interviews?",
  "context": "Software engineering"
}
```

---

## 🧪 Test Cards (Chapa Test Mode)

```
Card Number: 4200 0000 0000 0000
CVV: 123
Expiry: 12/25
```

---

## 🔧 Common Issues

### "Payment initialization failed"
- ✅ Check CHAPA_SECRET_KEY is set
- ✅ Verify amount is >= 1 ETB
- ✅ Ensure email format is valid

### "AI API error"
- ✅ Check API key is correct
- ✅ Verify key hasn't expired
- ✅ Restart backend after changing .env

### "CORS error"
- ✅ Check FRONTEND_URL in backend .env
- ✅ Restart backend server

---

## 📖 Full Documentation

- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **API Documentation**: See `README.md`
- **Chapa Docs**: https://developer.chapa.co
- **Groq Docs**: https://console.groq.com/docs

---

## 💡 Pro Tips

1. **Use Groq for AI** - It's free and very fast
2. **Test Mode First** - Use Chapa test keys before production
3. **Monitor Usage** - Check API usage in dashboards
4. **Cache AI Responses** - Save costs and improve speed
5. **Webhook Testing** - Use ngrok for local webhook testing

---

## 🆘 Need Help?

- 📧 Email: support@simuai.com
- 📚 Docs: See INTEGRATION_GUIDE.md
- 🐛 Issues: GitHub Issues

---

**Ready to go!** 🎉

Start the servers and visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health
