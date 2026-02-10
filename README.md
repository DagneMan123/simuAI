# 🎯 SimuAI - AI-Powered Talent Assessment Platform

## ⚡ Quick Start (Windows)

**The fastest way to get started:**

1. **Start Backend:**
   ```bash
   start-backend.bat
   ```

2. **Start Frontend (new terminal):**
   ```bash
   start-frontend.bat
   ```

3. **Login as Admin:**
   - URL: http://localhost:3000/login
   - Email: `admin@simuai.com`
   - Password: `Admin@123`

**That's it!** 🎉

---

# SimuAI - AI-Powered Talent Assessment Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.4-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20+-green" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2.1-lightgrey" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Latest-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7.3.0-2D3748" alt="Prisma" />
</div>

## 🚀 Overview

SimuAI is a cutting-edge AI-powered talent assessment platform that revolutionizes the hiring process. It enables employers to create realistic job simulations and evaluate candidates based on actual skills rather than just resumes.

### ✨ Key Features

- **AI-Powered Evaluation**: Advanced algorithms assess candidates with precision
- **Real-World Simulations**: Test candidates in realistic job scenarios
- **Integrity Monitoring**: Built-in proctoring ensures fair assessments
- **Instant Results**: Comprehensive evaluation reports in minutes
- **Advanced Analytics**: Deep insights into candidate performance
- **Multi-Role Support**: Separate dashboards for Admins, Employers, and Candidates
- **Real-time Communication**: WebSocket integration for live updates
- **Secure Authentication**: JWT-based auth with role-based access control

## 🏗️ Architecture

```
simuai/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, Socket)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API services and utilities
│   │   └── constants/       # App constants
│   └── package.json
│
└── backend/                 # Node.js + Express backend
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── middleware/      # Auth, validation, error handling
    │   ├── routes/          # API routes
    │   ├── services/        # Business logic
    │   └── server.js        # Entry point
    ├── prisma/
    │   └── schema.prisma    # Database schema
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.4 with TypeScript
- **Routing**: React Router DOM 7.13.0
- **State Management**: Redux + React Query
- **UI Components**: Radix UI + Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Logging**: Morgan

## 📦 Installation

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd simuai
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

**Backend Environment Variables** (`.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/simuai"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
GROQ_API_KEY="your-groq-api-key"
FRONTEND_URL="http://localhost:3000"
PORT=5000
NODE_ENV="development"
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env if needed

# Start development server
npm run dev
```

**Frontend Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SimuAI
VITE_APP_DESCRIPTION=AI-Powered Talent Assessment Platform
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Application Structure

### User Roles

1. **Admin**
   - Manage all users
   - View system logs
   - Monitor platform statistics
   - Verify employer accounts

2. **Employer**
   - Create and manage assessments
   - Invite candidates
   - Review submissions
   - Access analytics dashboard
   - Manage payment plans

3. **Candidate**
   - Take assessments
   - View results
   - Track progress
   - Receive invitations

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Employer
- `GET /api/employer/simulations` - Get all simulations
- `POST /api/employer/simulations` - Create simulation
- `PUT /api/employer/simulations/:id` - Update simulation
- `DELETE /api/employer/simulations/:id` - Delete simulation
- `GET /api/employer/simulations/:id/submissions` - Get submissions
- `POST /api/employer/simulations/:id/invite` - Invite candidates

### Candidate
- `GET /api/candidate/simulations` - Get available assessments
- `POST /api/candidate/simulations/:id/start` - Start assessment
- `POST /api/candidate/simulations/:id/complete` - Complete assessment
- `GET /api/candidate/simulations/:id/results` - Get results

### Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/logs` - Get system logs

## 🎨 UI Components

The application uses a comprehensive design system built with:
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📊 Database Schema

Key models:
- **User**: User accounts with role-based access
- **Simulation**: Assessment templates
- **Submission**: Candidate responses
- **Invitation**: Assessment invitations
- **Payment**: Transaction records

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance Optimization

- Code splitting with React lazy loading
- Image optimization
- API response caching
- Database query optimization with Prisma
- Compression middleware
- CDN integration ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@simuai.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Video interview integration
- [ ] Advanced AI models
- [ ] Mobile app (React Native)
- [ ] API marketplace
- [ ] White-label solution
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Integration with ATS systems

## 📞 Contact

- Website: https://simuai.com
- Email: info@simuai.com
- Twitter: @simuai
- LinkedIn: /company/simuai

---

Made with ❤️ by the SimuAI Team
