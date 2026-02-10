import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { SocketProvider } from '@/contexts/SocketContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import ProtectedRoute from '@/components/ProtectedRoute'
import SessionTimeout from '@/components/SessionTimeout'

// Pages
import LandingPage from '@/pages/LandingPage'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import EmployerDashboard from '@/pages/employer/Dashboard'
import CandidateDashboard from '@/pages/candidate/Dashboard'
import SimulationArena from '@/components/SimulationArena'
import SimulationBuilder from '@/pages/employer/SimulationBuilder'
import Submissions from '@/pages/employer/Submissions'
import AdminDashboard from '@/pages/admin/Dashboard'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

// Store
import { store } from '@/store/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router>
            <AuthProvider>
              <SocketProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <EmployerDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/simulations">
                    <Route index element={
                      <ProtectedRoute allowedRoles={['EMPLOYER']}>
                        <EmployerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="create" element={
                      <ProtectedRoute allowedRoles={['EMPLOYER']}>
                        <SimulationBuilder />
                      </ProtectedRoute>
                    } />
                    <Route path=":id" element={
                      <ProtectedRoute>
                        <SimulationArena />
                      </ProtectedRoute>
                    } />
                  </Route>

                  <Route path="/candidates" element={
                    <ProtectedRoute allowedRoles={['EMPLOYER']}>
                      <Submissions />
                    </ProtectedRoute>
                  } />

                  <Route path="/my-assessments" element={
                    <ProtectedRoute allowedRoles={['CANDIDATE']}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Session Timeout for authenticated users */}
                <ProtectedRoute>
                  <SessionTimeout timeoutInMinutes={30} warningInMinutes={5} />
                </ProtectedRoute>
                
                <Toaster />
              </SocketProvider>
            </AuthProvider>
          </Router>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App