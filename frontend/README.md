# SimuAI Frontend

React + TypeScript frontend for the SimuAI talent assessment platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SimuAI
VITE_APP_DESCRIPTION=AI-Powered Talent Assessment Platform
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── candidate/      # Candidate-specific components
│   │   ├── employer/       # Employer-specific components
│   │   ├── forms/          # Form components
│   │   └── ui/             # UI primitives (Shadcn)
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── candidate/      # Candidate pages
│   │   └── employer/       # Employer pages
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── SocketContext.tsx # WebSocket connection
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and services
│   │   ├── api.ts          # API client
│   │   ├── authService.ts  # Auth utilities
│   │   ├── aiService.ts    # AI service
│   │   └── utils.ts        # Helper functions
│   ├── constants/          # App constants
│   ├── layouts/            # Layout components
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json
```

## 🎨 Tech Stack

- **Framework**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 5.4.21
- **Routing**: React Router DOM 7.13.0
- **State Management**: Redux + React Query
- **UI Library**: Radix UI + Tailwind CSS
- **Animations**: Framer Motion 12.29.2
- **Forms**: React Hook Form 7.71.1
- **Validation**: Zod 4.3.6
- **HTTP Client**: Axios 1.13.4
- **Real-time**: Socket.io Client 4.8.3
- **Icons**: Lucide React 0.563.0
- **Charts**: Recharts 3.7.0

## 🧩 Key Components

### Authentication
- `Login.tsx` - User login page
- `Register.tsx` - User registration
- `AuthContext.tsx` - Auth state management
- `ProtectedRoute.tsx` - Route protection

### Admin Dashboard
- `Dashboard.tsx` - Admin overview
- `Users.tsx` - User management
- `SystemLogs.tsx` - System logs viewer
- `Verification.tsx` - Employer verification

### Employer Dashboard
- `Dashboard.tsx` - Employer overview
- `SimulationBuilder.tsx` - Create/edit assessments
- `Submissions.tsx` - Review candidate submissions
- `PipelineBoard.tsx` - Candidate pipeline
- `ChapaPayment.tsx` - Payment integration

### Candidate Dashboard
- `Dashboard.tsx` - Candidate overview
- `AssessmentRoom.tsx` - Take assessments
- `AssessmentResults.tsx` - View results
- `AIChatArena.tsx` - AI interaction
- `IntegrityMonitor.tsx` - Proctoring

### Shared Components
- `Navbar.tsx` - Navigation bar
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorBoundary.tsx` - Error handling
- `NotificationCenter.tsx` - Notifications
- `SessionTimeout.tsx` - Session management

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. Token attached to all API requests
5. Protected routes check authentication
6. Role-based access control enforced

## 🎯 User Roles

### Admin
- Access: `/admin/*`
- Features: User management, system monitoring, verification

### Employer
- Access: `/dashboard`, `/simulations/*`, `/candidates`
- Features: Create assessments, invite candidates, review submissions

### Candidate
- Access: `/my-assessments`, `/simulations/:id`
- Features: Take assessments, view results, track progress

## 📡 API Integration

All API calls are centralized in `src/lib/api.ts`:

```typescript
import { authApi, employerApi, candidateApi, adminApi } from '@/lib/api';

// Example usage
const response = await authApi.login(email, password);
const simulations = await employerApi.getSimulations();
const results = await candidateApi.getResults(id);
```

## 🔌 WebSocket Integration

Real-time features using Socket.io:

```typescript
import { useSocket } from '@/contexts/SocketContext';

const { socket } = useSocket();

// Join room
socket.emit('join-room', userId);

// Listen for events
socket.on('interview-started', (data) => {
  console.log('Interview started:', data);
});
```

## 🎨 Styling

Using Tailwind CSS with custom configuration:

```tsx
// Example component
<div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
```

**Custom Colors:**
- Primary: Blue (600)
- Secondary: Purple (600)
- Success: Green (500)
- Error: Red (500)
- Warning: Yellow (500)

## 🧪 Form Validation

Using React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

## 📊 State Management

### React Query (Server State)
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['simulations'],
  queryFn: () => employerApi.getSimulations()
});
```

### Redux (Client State)
```typescript
import { useDispatch, useSelector } from 'react-redux';

const dispatch = useDispatch();
const user = useSelector((state) => state.auth.user);
```

## 🎭 Animations

Using Framer Motion:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 🧩 Custom Hooks

- `useAuth()` - Authentication state
- `useToast()` - Toast notifications
- `useDebounce()` - Debounce values
- `useLocalStorage()` - Local storage sync
- `useTheme()` - Theme management
- `useIntegrity()` - Integrity monitoring

## 📱 Responsive Design

Mobile-first approach with Tailwind breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🚀 Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists
- Debounced search inputs
- Optimistic UI updates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- `postcss.config.js` - PostCSS config
- `eslint.config.js` - ESLint config

## 🎯 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |
| VITE_SOCKET_URL | WebSocket URL | http://localhost:5000 |
| VITE_APP_NAME | Application name | SimuAI |
| VITE_APP_DESCRIPTION | App description | AI-Powered Talent Assessment Platform |

## 🐛 Debugging

### React DevTools
Install React DevTools browser extension for component inspection.

### Redux DevTools
Install Redux DevTools for state debugging.

### React Query DevTools
Already integrated - press `Ctrl+Shift+D` to toggle.

## 📝 Code Style

- Use functional components with hooks
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful component names
- Add JSDoc comments for complex logic

## 🤝 Contributing

1. Create a feature branch
2. Follow the existing code style
3. Write tests for new features
4. Update documentation
5. Submit a pull request

## 📞 Support

For issues or questions, contact the development team.

---

Built with ❤️ using React + TypeScript
