import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard,
  Settings,
  LogOut,
  Bell,
  PlusCircle,
  Building,
  Search,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

const EmployerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [credits, setCredits] = useState(150);

  const navItems = [
    { path: ROUTES.EMPLOYER_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: ROUTES.EMPLOYER_CREATE_SIMULATION, icon: <PlusCircle size={20} />, label: 'Create Simulation' },
    { path: ROUTES.EMPLOYER_CANDIDATES, icon: <Users size={20} />, label: 'Candidates' },
    { path: ROUTES.EMPLOYER_INTERVIEWS, icon: <FileText size={20} />, label: 'Interviews' },
    { path: ROUTES.EMPLOYER_TEMPLATES, icon: <Building size={20} />, label: 'Templates' },
    { path: ROUTES.EMPLOYER_BILLING, icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/employer/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        {/* Logo & Credits */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">SimuAI</h1>
                <p className="text-xs text-gray-500">Employer Portal</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">Available Credits</p>
                  <p className="text-2xl font-bold text-blue-600">{credits}</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.EMPLOYER_DASHBOARD}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
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

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-semibold text-blue-600">
                {user?.name?.charAt(0) || 'E'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{user?.company || 'Company'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.name || 'Employer'}</p>
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
                <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
                <p className="text-gray-600">Find and assess the best candidates</p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10"
                  />
                </div>
                
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  onClick={() => navigate(ROUTES.EMPLOYER_CREATE_SIMULATION)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Simulation
                </Button>
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
              © {new Date().getFullYear()} SimuAI Employer Portal. 
              <span className="ml-2 font-medium text-blue-600">{credits} credits remaining</span>
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Help Center</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">API Docs</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact Sales</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default EmployerLayout;