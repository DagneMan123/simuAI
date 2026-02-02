import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, User, Building, Eye, EyeOff, Briefcase } from 'lucide-react'

// Define the form data type based on your AuthContext
interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  role: 'EMPLOYER' | 'CANDIDATE';
}

const Register: React.FC = () => {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') === 'candidate' ? 'CANDIDATE' : 'EMPLOYER'
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    role: defaultRole,
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    // Company validation for employers
    if (formData.role === 'EMPLOYER' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for employers'
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Prepare data for registration
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        company: formData.role === 'EMPLOYER' ? formData.company : undefined,
      }
      
      await register(registrationData)
      navigate('/dashboard')
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (role: 'EMPLOYER' | 'CANDIDATE') => {
    setFormData(prev => ({ ...prev, role }))
    // Clear company error if switching from employer to candidate
    if (role === 'CANDIDATE' && errors.company) {
      setErrors(prev => ({ ...prev, company: '' }))
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        // Add background image
        backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Optional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-blue-900/20" />
      
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 z-20" />
      
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Join SimuAI to revolutionize your hiring or career journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="text-white">
                {apiError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium text-base">I am a...</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('EMPLOYER')}
                  className={`
                    flex flex-col items-center justify-between rounded-xl border-2 p-5 transition-all
                    ${formData.role === 'EMPLOYER' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <Building className={`h-8 w-8 mb-3 ${formData.role === 'EMPLOYER' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${formData.role === 'EMPLOYER' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Employer
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Hire candidates</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleChange('CANDIDATE')}
                  className={`
                    flex flex-col items-center justify-between rounded-xl border-2 p-5 transition-all
                    ${formData.role === 'CANDIDATE' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <Briefcase className={`h-8 w-8 mb-3 ${formData.role === 'CANDIDATE' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${formData.role === 'CANDIDATE' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Candidate
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Find opportunities</span>
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Company Field (only for employers) */}
            {formData.role === 'EMPLOYER' && (
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700 font-medium">
                  Company Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your Company Inc."
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                {errors.company && (
                  <p className="text-sm text-red-600">{errors.company}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-11 pr-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold 
                  bg-gradient-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800 
                  text-white rounded-lg
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Button 
            asChild
            variant="outline" 
            className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
          >
            <Link to="/login">
              Sign In to Existing Account
            </Link>
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center text-center space-y-3 pb-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline font-medium">Terms</Link> and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>.
          </p>
        </CardFooter>
      </Card>

      {/* Test button (remove in production) */}
      <button
        onClick={() => {
          setFormData({
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            company: 'Test Company',
            role: 'EMPLOYER',
          })
          setConfirmPassword('password123')
        }}
        className="fixed bottom-4 right-4 text-xs bg-gray-800 text-white px-3 py-1 rounded opacity-70 hover:opacity-100 transition-opacity z-20"
      >
        Fill Demo Data
      </button>
    </div>
  )
}

export default Register