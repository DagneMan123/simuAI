import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Play,
  Star,
  Award,
  BarChart3,
  Globe,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 5420,
    assessmentsCompleted: 12340,
    companiesServed: 150,
    successRate: 94,
    apiEndpoints: 60,
    uiComponents: 50,
    securityFeatures: 15,
    aiProviders: 3
  });

  useEffect(() => {
    // Animate numbers on load
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 5420,
        assessmentsCompleted: 12340,
        companiesServed: 150,
        successRate: 94,
        apiEndpoints: 60,
        uiComponents: 50,
        securityFeatures: 15,
        aiProviders: 3
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Evaluation',
      description: 'Advanced AI algorithms with multi-provider support (Groq, OpenAI, Anthropic) assess candidates with precision and eliminate bias',
      color: 'from-indigo-500 to-purple-500',
      details: ['Multi-provider AI support', 'Bias-free evaluation', 'Intelligent scoring', 'Natural language processing']
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Real-World Simulations',
      description: 'Test candidates in realistic job scenarios with 60+ API endpoints supporting comprehensive assessment workflows',
      color: 'from-blue-500 to-cyan-500',
      details: ['Job-specific scenarios', 'Interactive simulations', 'Performance tracking', 'Skill validation']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Built-in proctoring, JWT authentication, rate limiting, and 15+ security features ensure fair and secure assessments',
      color: 'from-emerald-500 to-teal-500',
      details: ['JWT authentication', 'Rate limiting', 'CORS protection', 'Data encryption']
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get comprehensive evaluation reports in minutes with real-time processing and advanced analytics',
      color: 'from-amber-500 to-orange-500',
      details: ['Real-time processing', 'Instant feedback', 'Automated scoring', 'Quick turnaround']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Deep insights with 50+ UI components, responsive dashboards, and comprehensive reporting tools',
      color: 'from-pink-500 to-rose-500',
      details: ['Performance metrics', 'Skill gap analysis', 'Trend tracking', 'Custom reports']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Platform',
      description: 'Assess candidates anywhere with multi-currency support, mobile-responsive design, and cloud infrastructure',
      color: 'from-violet-500 to-purple-500',
      details: ['Multi-currency support', 'Mobile responsive', 'Cloud-based', 'Global accessibility']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      avatar: 'SJ',
      content: 'SimuAI transformed our hiring process. We reduced time-to-hire by 60% and improved candidate quality significantly.',
      rating: 5,
      company: 'TechCorp'
    },
    {
      name: 'Michael Chen',
      role: 'Talent Manager, StartupHub',
      avatar: 'MC',
      content: 'The AI-powered assessments are incredibly accurate. We\'ve made better hiring decisions since switching to SimuAI.',
      rating: 5,
      company: 'StartupHub'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Recruitment Lead, GlobalTech',
      avatar: 'ER',
      content: 'Best investment we\'ve made in our recruitment tech stack. The ROI is outstanding.',
      rating: 5,
      company: 'GlobalTech'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams',
      features: [
        'Up to 50 assessments/month',
        'Basic AI evaluation',
        'Email support',
        'Standard templates',
        'Basic analytics'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 200 assessments/month',
        'Advanced AI evaluation',
        'Priority support',
        'Custom templates',
        'Advanced analytics',
        'API access',
        'Team collaboration'
      ],
      popular: true,
      cta: 'Get Started'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited assessments',
        'Premium AI models',
        '24/7 dedicated support',
        'White-label solution',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const trustedCompanies = [
    'TechCorp', 'StartupHub', 'GlobalTech', 'InnovateCo', 'FutureSoft', 'DataDrive'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SimuAI
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#features" className="text-slate-700 hover:text-indigo-600 transition font-medium text-sm xl:text-base">Features</a>
              <a href="/about" className="text-slate-700 hover:text-indigo-600 transition font-medium text-sm xl:text-base">About</a>
              <a href="#how-it-works" className="text-slate-700 hover:text-indigo-600 transition font-medium text-sm xl:text-base">How It Works</a>
              <a href="#pricing" className="text-slate-700 hover:text-indigo-600 transition font-medium text-sm xl:text-base">Pricing</a>
              <a href="#testimonials" className="text-slate-700 hover:text-indigo-600 transition font-medium text-sm xl:text-base">Testimonials</a>
            </div>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-700 hover:text-indigo-600 text-sm lg:text-base">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30 text-sm lg:text-base">
                Get Started <ArrowRight className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-slate-200"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-700 hover:text-indigo-600 transition font-medium">Features</a>
                <a href="/about" className="text-slate-700 hover:text-indigo-600 transition font-medium">About</a>
                <a href="#how-it-works" className="text-slate-700 hover:text-indigo-600 transition font-medium">How It Works</a>
                <a href="#pricing" className="text-slate-700 hover:text-indigo-600 transition font-medium">Pricing</a>
                <a href="#testimonials" className="text-slate-700 hover:text-indigo-600 transition font-medium">Testimonials</a>
                <Button variant="ghost" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600">
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">AI-Powered Talent Assessment Platform</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Hire Smarter with
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Powered Assessments
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Transform your recruitment process with intelligent simulations that evaluate real skills, 
              not just resumes. Make data-driven hiring decisions in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-base sm:text-lg px-6 sm:px-8 shadow-xl shadow-indigo-500/30 group w-full sm:w-auto" 
                onClick={() => navigate('/register')}
              >
                Start Free Trial 
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 group w-full sm:w-auto">
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" /> 
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 sm:mt-12">
              <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">Trusted by leading companies worldwide</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 items-center opacity-60">
                {trustedCompanies.map((company, index) => (
                  <div key={index} className="text-slate-400 font-semibold text-sm sm:text-base lg:text-lg">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-0"
          >
            {[
              { label: 'API Endpoints', value: `${stats.apiEndpoints}+`, icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'indigo' },
              { label: 'UI Components', value: `${stats.uiComponents}+`, icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'blue' },
              { label: 'Security Features', value: `${stats.securityFeatures}+`, icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'emerald' },
              { label: 'AI Providers', value: `${stats.aiProviders}`, icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'purple' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm hover:-translate-y-1 group">
                  <div className={`flex justify-center mb-2 sm:mb-3 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Features</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 mt-2">
                Powerful Features for Modern Hiring
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to assess, evaluate, and hire top talent efficiently
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 sm:p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-slate-200/60 bg-white group relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className={`relative inline-flex p-2 sm:p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity text-sm sm:text-base">
                    Learn more <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How SimuAI Works
            </h2>
            <p className="text-xl text-slate-600">Simple, fast, and effective</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Assessment', description: 'Design custom simulations or use our templates', icon: <Target />, color: 'indigo' },
              { step: '02', title: 'Invite Candidates', description: 'Send assessments via email or share links', icon: <Users />, color: 'blue' },
              { step: '03', title: 'Get Results', description: 'AI analyzes and ranks candidates instantly', icon: <BarChart3 />, color: 'cyan' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300">
                  <div className={`text-6xl font-bold bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 bg-clip-text text-transparent mb-4`}>{item.step}</div>
                  <div className={`flex justify-center mb-4 text-${item.color}-600 bg-${item.color}-50 w-16 h-16 rounded-2xl mx-auto items-center`}>{item.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-indigo-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 mt-2">
                Trusted by Leading Companies
              </h2>
              <p className="text-xl text-slate-600">See what our customers say</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full bg-white border-slate-200/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  {/* Quote mark decoration */}
                  <div className="absolute top-0 right-0 text-indigo-100 text-9xl font-serif leading-none opacity-50 group-hover:opacity-100 transition-opacity">
                    "
                  </div>
                  
                  <div className="relative">
                    {/* Stars */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-slate-700 mb-6 italic leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center border-t border-slate-200 pt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role}</div>
                        <div className="text-xs text-indigo-600 font-medium mt-1">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Pricing</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 mt-2">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-slate-600">Choose the plan that fits your needs</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-8 h-full relative ${
                  plan.popular 
                    ? 'border-2 border-indigo-600 shadow-2xl shadow-indigo-500/20 bg-white scale-105 z-10' 
                    : 'bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-shadow'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 text-lg">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30' 
                        : 'border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 bg-white'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/register')}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Money back guarantee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-slate-600">
              <Shield className="w-5 h-5 inline mr-2 text-emerald-500" />
              30-day money-back guarantee • No credit card required for trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-amber-300 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies making smarter hiring decisions with SimuAI. 
              Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-slate-100 shadow-2xl text-lg px-8 group" 
                onClick={() => navigate('/register')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
              >
                Schedule Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">SimuAI</span>
              </div>
              <p className="text-sm text-slate-400">AI-powered talent assessment platform for modern hiring.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-indigo-400 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p className="text-slate-400">&copy; 2026 SimuAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
