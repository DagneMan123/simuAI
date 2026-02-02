import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Menu, 
  X,
  Shield,
  Users,
  Award,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.PRICING, label: 'Pricing' },
    { path: '#features', label: 'Features' },
    { path: '#how-it-works', label: 'How It Works' },
    { path: '#testimonials', label: 'Testimonials' },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) return location.pathname === ROUTES.HOME;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to={ROUTES.HOME} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.APP_NAME}</h1>
                  <p className="text-xs text-gray-500">AI-Powered Assessments</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className={`
                    text-sm font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                    }
                  `}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Link to={ROUTES.LOGIN} className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{APP_CONFIG.APP_NAME}</h3>
                  <p className="text-sm text-gray-400">Revolutionizing Hiring</p>
                </div>
              </div>
              <p className="text-gray-400">
                AI-powered assessment platform that helps companies find the right talent 
                and candidates showcase their skills.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><Link to={ROUTES.TERMS} className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><Link to={ROUTES.PRIVACY} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Secure Assessments
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Users className="h-4 w-4 text-green-400" />
                  AI Proctoring
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Award className="h-4 w-4 text-yellow-400" />
                  Skill Analytics
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Globe className="h-4 w-4 text-purple-400" />
                  Global Reach
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {APP_CONFIG.APP_NAME}. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <span>{APP_CONFIG.COMPANY_NAME}</span>
                <span>{APP_CONFIG.COMPANY_ADDRESS}</span>
                <a href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`} className="hover:text-white">
                  {APP_CONFIG.SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;