import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  User,
  Award,
  Briefcase,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Fixed: Removed setProfileScore to clear the 'unused variable' warning
  const [profileScore] = useState(75);

  const navItems = [
    { path: ROUTES.CANDIDATE_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: ROUTES.CANDIDATE_JOBS, icon: <Briefcase size={20} />, label: 'Find Jobs' },
    { path: ROUTES.CANDIDATE_MY_RESULTS, icon: <FileText size={20} />, label: 'My Results' },
    { path: ROUTES.CANDIDATE_PRACTICE, icon: <Award size={20} />, label: 'Practice Tests' },
    { path: ROUTES.CANDIDATE_PROFILE, icon: <User size={20} />, label: 'My Profile' },
    { path: '/candidate/settings', icon: <Clock size={20} />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-40
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        {/* Logo & Profile Score */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">SimuAI</h1>
                <p className="text-xs text-gray-500">Candidate Portal</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Profile Score</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {profileScore}%
                </Badge>
              </div>
              <Progress value={profileScore} className="h-2" />
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => navigate(ROUTES.CANDIDATE_PROFILE)}
              >
                <TrendingUp className="mr-2 h-3 w-3" />
                Improve Score
              </Button>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.CANDIDATE_DASHBOARD}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${!sidebarOpen && 'justify-center'}
              `}
              title={!sidebarOpen ? item.label : ''}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Upcoming Tests */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Tests</h3>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded border border-blue-100">
                <p className="text-xs font-medium text-gray-800">Frontend Developer</p>
                <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-100">
                <p className="text-xs font-medium text-gray-800">React Assessment</p>
                <p className="text-xs text-gray-500">In 2 days</p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="font-semibold text-green-600">
                {user?.fullName?.charAt(0) || 'C'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{user?.fullName || 'Candidate'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'candidate@example.com'}</p>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            className={`w-full justify-start gap-3 ${!sidebarOpen && 'justify-center px-0'}`}
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 min-h-screen
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Candidate Dashboard</h1>
                <p className="text-gray-600">Level up your career with AI-powered assessments</p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, tests..."
                    className="pl-10"
                  />
                </div>
                
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </Button>
                
                <Badge variant="outline" className="hidden sm:flex items-center gap-2 border-green-200">
                  <Award className="h-3 w-3 text-green-600" />
                  <span className="text-green-700">{profileScore} Profile Score</span>
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="mt-8 px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SimuAI Candidate Portal. 
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Career Tips</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">FAQ</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CandidateLayout;