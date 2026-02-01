import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// እዚህ ጋር Briefcase ተጨምሯል
import { CheckCircle, Zap, Shield, BarChart3, Users, Clock, Briefcase } from 'lucide-react' 
import Navbar from '@/components/Navbar'

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time AI Simulations",
      description: "Candidates solve real-world problems with AI-powered interactions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Anti-Cheat Protection",
      description: "Advanced monitoring ensures assessment integrity."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Objective Evaluation",
      description: "AI-driven scoring eliminates human bias in hiring."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Blind Hiring Mode",
      description: "Anonymize candidate data to focus purely on skills."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Time-Efficient",
      description: "Reduce hiring time by 70% with automated assessments."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Compliance Ready",
      description: "Built-in diversity analytics and EEOC reporting."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director, TechCorp",
      content: "SimuAI reduced our time-to-hire by 60% while improving candidate quality.",
      company: "TechCorp"
    },
    {
      name: "Michael Chen",
      role: "Engineering Manager",
      content: "The code simulations are incredibly realistic. We've hired our best engineers through SimuAI.",
      company: "InnovateLabs"
    },
    {
      name: "Priya Patel",
      role: "Diversity & Inclusion Lead",
      content: "Blind hiring mode has transformed our recruitment process for the better.",
      company: "GlobalFinance"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Hire for{' '}
            <span className="gradient-text">Talent</span>
            , Not History
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            SimuAI revolutionizes hiring with AI-powered skill simulations. Replace biased resumes with real-time, objective assessments of candidate abilities.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/register?role=employer">
                Start Hiring Smarter
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link to="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why SimuAI Stands Out
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built with cutting-edge technology to deliver fair, efficient, and insightful hiring.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              How SimuAI Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Three simple steps to transform your hiring process
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create Simulation</h3>
                <p className="text-muted-foreground">
                  Employers design realistic job simulations using our no-code builder
                </p>
              </div>
              <div className="relative text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Candidate Assessment</h3>
                <p className="text-muted-foreground">
                  Candidates complete simulations in a secure, monitored environment
                </p>
              </div>
              <div className="relative text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Evaluation</h3>
                <p className="text-muted-foreground">
                  Our AI objectively scores performance and provides detailed insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See what companies are saying about their SimuAI experience
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mb-6 italic text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
            Join hundreds of companies using SimuAI to build better, more diverse teams.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-white px-8 text-blue-600 hover:bg-white/90">
              <Link to="/register?role=employer">
                Start Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-white px-8 text-white hover:bg-white/10">
              <Link to="/contact">
                Schedule Demo
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SimuAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revolutionizing hiring with AI-powered skill assessments.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-primary">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-primary">API</Link></li>
                <li><Link to="/status" className="hover:text-primary">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">About</Link></li>
                <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link to="/press" className="hover:text-primary">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Terms</Link></li>
                <li><Link to="/security" className="hover:text-primary">Security</Link></li>
                <li><Link to="/compliance" className="hover:text-primary">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SimuAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage