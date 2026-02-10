import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Award,
  Globe,
  Code,
  Database,
  Lock,
  CreditCard,
  Bot,
  Smartphone,
  Monitor,
  Server,
  Layers,
  Settings,
  Briefcase,
  Eye,
  Palette,
  Gauge,
  BookOpen,
  Headphones
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'API Endpoints', value: '60+', icon: <Server className="w-6 h-6" />, color: 'indigo' },
    { label: 'UI Components', value: '50+', icon: <Layers className="w-6 h-6" />, color: 'blue' },
    { label: 'Security Features', value: '15+', icon: <Shield className="w-6 h-6" />, color: 'emerald' },
    { label: 'AI Providers', value: '3', icon: <Bot className="w-6 h-6" />, color: 'purple' }
  ];

  const backendFeatures = [
    {
      category: 'Authentication & Security',
      icon: <Lock className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500',
      features: [
        'JWT Authentication with refresh tokens',
        'Password hashing with bcrypt',
        'Role-based access control (Admin, Employer, Candidate)',
        'Rate limiting (100 requests/15min)',
        'CORS configuration',
        'Helmet security headers',
        'Input validation with express-validator',
        'SQL injection prevention with Prisma ORM',
        'XSS protection',
        'Webhook signature verification'
      ]
    },
    {
      category: 'API Endpoints',
      icon: <Server className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Authentication (7 endpoints)',
        'Admin Management (7 endpoints)',
        'Employer Features (15 endpoints)',
        'Candidate Features (12 endpoints)',
        'Payment Integration (5 endpoints)',
        'AI Services (8 endpoints)',
        'File Upload (5 endpoints)',
        'Webhooks (3 endpoints)'
      ]
    },
    {
      category: 'Payment Integration',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Chapa Payment Gateway integration',
        'Multiple payment methods (Cards, Mobile Money, Bank)',
        'Payment verification and callbacks',
        'Subscription management',
        'Payment history tracking',
        'Multi-currency support (ETB, USD, EUR)',
        'Test and production modes',
        'Webhook handling for payment events'
      ]
    },
    {
      category: 'AI Integration',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-500',
      features: [
        'Multi-provider support (Groq, OpenAI, Anthropic)',
        'Question generation',
        'Answer evaluation',
        'Career advice',
        'Interview analysis',
        'AI chatbot',
        'Feedback generation',
        'Image analysis (OCR)',
        'Speech-to-text conversion'
      ]
    }
  ];

  const frontendFeatures = [
    {
      category: 'Professional Design',
      icon: <Palette className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500',
      features: [
        'Modern gradient backgrounds (Indigo/Blue/Cyan)',
        'Smooth animations with Framer Motion',
        'Responsive design (mobile-first)',
        'Glassmorphism effects',
        'Hover animations and micro-interactions',
        'Loading states and skeletons',
        'Error boundaries and fallbacks',
        'Toast notifications',
        'Modal dialogs',
        'Professional color scheme'
      ]
    },
    {
      category: 'Pages & Components',
      icon: <Monitor className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Professional Landing Page',
        'Secure Login & Registration',
        'Admin Dashboard with analytics',
        'Employer Dashboard',
        'Candidate Assessment Portal',
        'Profile Management',
        'Settings & Configuration',
        'Data Tables with sorting/filtering',
        'Form components with validation',
        'Charts and analytics'
      ]
    },
    {
      category: 'Responsive Design',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Mobile-first approach',
        'Tablet optimization',
        'Desktop layouts',
        'Touch-friendly interfaces',
        'Adaptive navigation',
        'Responsive tables',
        'Mobile menus',
        'Cross-browser compatibility',
        'Accessibility compliance',
        'Performance optimized'
      ]
    },
    {
      category: 'Developer Experience',
      icon: <Code className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      features: [
        'TypeScript for type safety',
        'Hot module replacement',
        'ESLint configuration',
        'Prettier formatting',
        'Git hooks ready',
        'Environment variables',
        'Error boundaries',
        'Debug logging',
        'Code splitting',
        'Lazy loading'
      ]
    }
  ];

  const platformFeatures = [
    {
      title: 'For Employers',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500',
      features: [
        'Create custom assessments',
        'AI-powered question generation',
        'Invite candidates via email',
        'Review submissions with AI evaluation',
        'Export results to CSV',
        'Track candidate pipeline',
        'Payment integration for premium features',
        'Advanced analytics and reporting'
      ]
    },
    {
      title: 'For Candidates',
      icon: <Users className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-500',
      features: [
        'Take assessments seamlessly',
        'Real-time integrity monitoring',
        'Instant AI feedback',
        'View detailed results',
        'Download certificates',
        'Track progress over time',
        'Get personalized career advice',
        'Mobile-friendly interface'
      ]
    },
    {
      title: 'For Admins',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Complete user management',
        'System monitoring and logs',
        'Platform statistics',
        'Manage invitations',
        'Access control',
        'Revenue tracking',
        'Performance monitoring',
        'Security oversight'
      ]
    }
  ];

  const techStack = [
    {
      category: 'Backend',
      icon: <Database className="w-6 h-6" />,
      technologies: [
        'Node.js & Express.js',
        'PostgreSQL with Prisma ORM',
        'JWT Authentication',
        'Socket.io for real-time',
        'Multer for file uploads',
        'Express Validator',
        'Rate limiting & Security',
        'Comprehensive logging'
      ]
    },
    {
      category: 'Frontend',
      icon: <Monitor className="w-6 h-6" />,
      technologies: [
        'React 19 with TypeScript',
        'Vite for fast builds',
        'Tailwind CSS v4',
        'Framer Motion animations',
        'React Router v7',
        'Radix UI primitives',
        'React Hook Form',
        'Zod validation'
      ]
    },
    {
      category: 'Integrations',
      icon: <Globe className="w-6 h-6" />,
      technologies: [
        'Chapa Payment Gateway',
        'Groq AI (Recommended)',
        'OpenAI GPT models',
        'Anthropic Claude',
        'Socket.io WebSockets',
        'File upload system',
        'Email notifications',
        'SMS integration'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Production Ready Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Complete AI-Powered
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Talent Assessment Platform
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover the comprehensive features and capabilities that make SimuAI the most advanced 
              talent assessment platform available today.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm hover:-translate-y-1 group">
                    <div className={`flex justify-center mb-3 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Backend Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Robust Backend Architecture
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enterprise-grade backend with 60+ API endpoints, comprehensive security, and seamless integrations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {backendFeatures.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 border-slate-200/60 bg-white group">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frontend Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Modern Frontend Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional UI with responsive design, smooth animations, and exceptional user experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {frontendFeatures.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm group">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Features for Every User
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tailored experiences for employers, candidates, and administrators
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {platformFeatures.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 border-slate-200/60 bg-white group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${platform.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                    {platform.title}
                  </h3>
                  <ul className="space-y-3">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Modern Technology Stack
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built with cutting-edge technologies for performance, scalability, and maintainability
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm group">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {tech.category}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {tech.technologies.map((technology, techIndex) => (
                      <li key={techIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{technology}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Ready */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">100% Production Ready</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Hiring Process?
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using SimuAI to make smarter hiring decisions 
              with AI-powered assessments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-lg px-8 shadow-xl shadow-indigo-500/30 group" 
                onClick={() => navigate('/register')}
              >
                Start Free Trial 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600"
                onClick={() => navigate('/login')}
              >
                <Eye className="mr-2 w-5 h-5" /> 
                View Demo
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">Complete Documentation</h4>
                <p className="text-sm text-slate-600">Comprehensive guides and API documentation</p>
              </div>
              <div>
                <Headphones className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">24/7 Support</h4>
                <p className="text-sm text-slate-600">Dedicated support team ready to help</p>
              </div>
              <div>
                <Gauge className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-900 mb-2">High Performance</h4>
                <p className="text-sm text-slate-600">Optimized for speed and scalability</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;