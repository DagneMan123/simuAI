# 🏗️ SimuAI Data Flow Architecture

## Overview
This document shows how data flows through the SimuAI platform after removing all mock data.

---

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │  Analytics   │  │   Results    │         │
│  │   Pages      │  │    Pages     │  │    Pages     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  React Query   │                           │
│                    │  (API Calls)   │                           │
│                    └───────┬────────┘                           │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Layer     │
                    │  (axios/fetch)  │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                      │
├────────────────────────────┼─────────────────────────────────────┤
│                            │                                      │
│                    ┌───────▼────────┐                            │
│                    │  Route Layer   │                            │
│                    │  (Express)     │                            │
│                    └───────┬────────┘                            │
│                            │                                      │
│              ┌─────────────┼─────────────┐                       │
│              │             │             │                       │
│      ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐               │
│      │ Auth/Role    │ │Validate│ │  Error     │               │
│      │ Middleware   │ │ Input  │ │  Handler   │               │
│      └───────┬──────┘ └───┬────┘ └─────┬──────┘               │
│              │             │             │                       │
│              └─────────────┼─────────────┘                       │
│                            │                                      │
│                    ┌───────▼────────┐                            │
│                    │  Controllers   │                            │
│                    │  (Business     │                            │
│                    │   Logic)       │                            │
│                    └───────┬────────┘                            │
│                            │                                      │
│              ┌─────────────┼─────────────┐                       │
│              │             │             │                       │
│      ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐               │
│      │   Prisma     │ │   AI   │ │  Payment   │               │
│      │   Client     │ │Service │ │  Service   │               │
│      └───────┬──────┘ └───┬────┘ └─────┬──────┘               │
│              │             │             │                       │
└──────────────┼─────────────┼─────────────┼───────────────────────┘
               │             │             │
       ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
       │  PostgreSQL  │ │ OpenAI │ │   Chapa    │
       │   Database   │ │   API  │ │    API     │
       └──────────────┘ └────────┘ └────────────┘
```

---

## 📊 Specific Data Flows

### 1. Dashboard Metrics Flow

```
Frontend: Dashboard.tsx
    │
    ├─ useQuery(['analytics'])
    │
    ▼
API: GET /api/employer/analytics
    │
    ├─ authMiddleware (verify JWT)
    ├─ roleMiddleware (check EMPLOYER role)
    │
    ▼
Controller: analyticsController.getEmployerAnalytics()
    │
    ├─ prisma.simulation.findMany()
    ├─ Calculate totalCandidates
    ├─ Calculate avgScore
    ├─ Calculate completionRate
    │
    ▼
Database: PostgreSQL
    │
    ├─ Query: simulations table
    ├─ Query: submissions table
    ├─ Query: candidates table
    │
    ▼
Response: { totalCandidates, avgScore, completionRate, topSkills }
    │
    ▼
Frontend: Display in cards with charts
```

### 2. Assessment Results Flow

```
Frontend: AssessmentResults.tsx
    │
    ├─ useQuery(['assessment-results', id])
    │
    ▼
API: GET /api/candidate/results/:id
    │
    ├─ authMiddleware
    ├─ roleMiddleware (CANDIDATE)
    │
    ▼
Controller: candidateController.getResults()
    │
    ├─ prisma.submission.findUnique()
    ├─ Include: simulation, scores, feedback
    │
    ▼
Database: PostgreSQL
    │
    ├─ Query: submissions table
    ├─ Query: ai_scores table
    ├─ Query: simulations table
    │
    ▼
Response: {
    overallScore,
    skillBreakdown,
    aiFeedback,
    comparisonData
}
    │
    ▼
Frontend: Display results with charts and feedback
```

### 3. AI Question Generation Flow

```
Frontend: SimulationBuilder.tsx
    │
    ├─ POST /api/jobs/:id/generate-questions
    │
    ▼
API: POST /api/jobs/:id/generate-questions
    │
    ├─ authMiddleware
    ├─ roleMiddleware (EMPLOYER)
    ├─ Validate: count, difficulty
    │
    ▼
Controller: jobController.generateQuestions()
    │
    ├─ prisma.job.findUnique()
    ├─ aiService.generateQuestions()
    │
    ▼
AI Service: aiService.generateQuestions()
    │
    ├─ Build prompt with job details
    ├─ Call OpenAI GPT-4 API
    │
    ▼
OpenAI API: GPT-4
    │
    ├─ Generate 5 interview questions
    ├─ Return JSON with questions
    │
    ▼
AI Service: Parse response
    │
    ├─ prisma.aiQuestion.create() for each
    ├─ Log token usage
    │
    ▼
Database: PostgreSQL
    │
    ├─ Insert: ai_questions table
    ├─ Insert: token_usage table
    │
    ▼
Response: Array of generated questions
    │
    ▼
Frontend: Display questions in builder
```

### 4. Payment Flow

```
Frontend: ChapaPayment.tsx
    │
    ├─ User selects plan
    ├─ Click "Proceed to Payment"
    │
    ▼
API: POST /api/payment/initialize
    │
    ├─ authMiddleware
    ├─ roleMiddleware (EMPLOYER)
    ├─ Validate: planId, amount
    │
    ▼
Controller: paymentController.initialize()
    │
    ├─ Get plan details
    ├─ Create payment record
    ├─ Call Chapa API
    │
    ▼
Chapa API: Initialize Payment
    │
    ├─ Create checkout session
    ├─ Return checkout_url
    │
    ▼
Database: PostgreSQL
    │
    ├─ Insert: payments table (status: pending)
    │
    ▼
Response: { checkout_url, tx_ref }
    │
    ▼
Frontend: Redirect to Chapa
    │
    ▼
User: Complete payment on Chapa
    │
    ▼
Chapa: Send webhook to backend
    │
    ▼
API: POST /api/webhooks/chapa
    │
    ├─ Verify HMAC signature
    ├─ Update payment status
    ├─ Add credits to user
    │
    ▼
Database: PostgreSQL
    │
    ├─ Update: payments table (status: completed)
    ├─ Update: users table (add credits)
    │
    ▼
Frontend: Redirect to success page
```

### 5. System Logs Flow

```
Frontend: SystemLogs.tsx
    │
    ├─ useQuery(['system-logs', filters])
    │
    ▼
API: GET /api/admin/logs?level=error&period=24h
    │
    ├─ authMiddleware
    ├─ roleMiddleware (ADMIN)
    │
    ▼
Controller: adminController.getLogs()
    │
    ├─ Parse query params
    ├─ Build where clause
    ├─ prisma.systemLog.findMany()
    │
    ▼
Database: PostgreSQL
    │
    ├─ Query: system_logs table
    ├─ Filter: by level, source, time
    ├─ Order: by timestamp DESC
    │
    ▼
Response: { logs: [...], total: 42 }
    │
    ▼
Frontend: Display in table with filters
```

### 6. Talent Analytics Flow

```
Frontend: TalentAnalytics.tsx
    │
    ├─ useQuery(['analyticsData', timeRange, simulation])
    │
    ▼
API: GET /api/analytics/talent?timeRange=30d&simulation=all
    │
    ├─ authMiddleware
    ├─ roleMiddleware (EMPLOYER)
    │
    ▼
Controller: analyticsController.getTalentAnalytics()
    │
    ├─ Calculate date range
    ├─ Build where clause
    ├─ prisma.simulation.findMany()
    ├─ Aggregate by month
    ├─ Calculate metrics
    │
    ▼
Database: PostgreSQL
    │
    ├─ Query: simulations table
    ├─ Query: submissions table
    ├─ Query: candidates table
    ├─ Aggregate: scores, completion rates
    │
    ▼
Response: {
    performanceData: [...],
    diversityData: [...],
    skillGaps: [...],
    topPerformers: [...]
}
    │
    ▼
Frontend: Display in charts and tables
```

---

## 🔐 Security Flow

```
Every API Request:
    │
    ├─ 1. Extract JWT from Authorization header
    │
    ▼
authMiddleware:
    │
    ├─ Verify JWT signature
    ├─ Check expiration
    ├─ Decode user info
    │
    ▼
roleMiddleware:
    │
    ├─ Check user role
    ├─ Verify permissions
    │
    ▼
Controller:
    │
    ├─ Validate input (express-validator)
    ├─ Check ownership (user can only access their data)
    ├─ Execute business logic
    │
    ▼
Response or Error
```

---

## 📈 Performance Optimizations

### 1. Database Queries
```
✅ Use indexes on frequently queried fields
✅ Use select to fetch only needed fields
✅ Use include for related data (avoid N+1)
✅ Use pagination for large datasets
✅ Use aggregation for statistics
```

### 2. API Layer
```
✅ React Query for caching
✅ Debounce search inputs
✅ Lazy load components
✅ Optimize bundle size
✅ Use CDN for static assets
```

### 3. AI Service
```
✅ Cache AI responses when possible
✅ Rate limit AI calls
✅ Use cheaper models for simple tasks
✅ Batch requests when possible
✅ Monitor token usage
```

---

## 🎯 Data Sources Summary

| Feature | Data Source | Type |
|---------|------------|------|
| Dashboard Metrics | PostgreSQL | Database Query |
| Assessment Results | PostgreSQL | Database Query |
| Talent Analytics | PostgreSQL | Aggregated Query |
| System Logs | PostgreSQL | Database Query |
| AI Questions | OpenAI GPT-4 | External API |
| Interview Analysis | OpenAI GPT-4 | External API |
| Image Analysis | GPT-4 Vision | External API |
| Speech-to-Text | Whisper API | External API |
| Payments | Chapa API | External API |
| User Data | PostgreSQL | Database Query |

---

## ✅ Verification Checklist

- [x] All frontend pages fetch from API
- [x] All API endpoints query database
- [x] No hardcoded mock data
- [x] Proper error handling
- [x] Loading states implemented
- [x] Authentication on all routes
- [x] Role-based access control
- [x] Input validation
- [x] Database indexes
- [x] API documentation

---

## 🚀 Deployment Considerations

### Environment Variables Required:
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...

# Payment
CHAPA_SECRET_KEY=CHASECK_...
CHAPA_WEBHOOK_SECRET=...

# App
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
```

### Database Setup:
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed initial data (optional)
npm run seed
```

### Monitoring:
```
✅ Set up error tracking (Sentry)
✅ Monitor API response times
✅ Track database query performance
✅ Monitor AI API usage and costs
✅ Set up alerts for errors
```

---

**Status**: Architecture documented and verified ✅
