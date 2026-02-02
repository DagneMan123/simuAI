import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard,
  Settings,
  PlusCircle,
  Building,
  FolderKanban,
  Bell,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

interface EmployerSidebarProps {
  collapsed?: boolean;
  credits?: number;
  onCollapse?: () => void;
}

const EmployerSidebar: React.FC<EmployerSidebarProps> = ({
  collapsed = false,
  credits = 150,
  onCollapse
}) => {
  const navItems = [
    { path: ROUTES.EMPLOYER_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard', badge: null },
    { path: ROUTES.EMPLOYER_CREATE_SIMULATION, icon: <PlusCircle size={20} />, label: 'Create Simulation', badge: 'New' },
    { path: ROUTES.EMPLOYER_CANDIDATES, icon: <Users size={20} />, label: 'Candidates', badge: '12' },
    { path: ROUTES.EMPLOYER_INTERVIEWS, icon: <FileText size={20} />, label: 'Interviews', badge: '3' },
    { path: ROUTES.EMPLOYER_TEMPLATES, icon: <Building size={20} />, label: 'Templates', badge: null },
    { path: '/employer/pipeline', icon: <FolderKanban size={20} />, label: 'Pipeline', badge: null },
    { path: ROUTES.EMPLOYER_BILLING, icon: <CreditCard size={20} />, label: 'Billing', badge: null },
    { path: '/employer/analytics', icon: <TrendingUp size={20} />, label: 'Analytics', badge: 'Pro' },
    { path: '/employer/settings', icon: <Settings size={20} />, label: 'Settings', badge: null },
    { path: '/employer/support', icon: <HelpCircle size={20} />, label: 'Support', badge: null },
  ];

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">SimuAI</h1>
              <p className="text-xs text-gray-500">Employer Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Credits Display */}
      {!collapsed && (
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Credits Balance</span>
            <Bell size={16} className="text-gray-500" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{credits}</p>
              <p className="text-xs text-gray-500 mt-1">Available credits</p>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add More
            </Button>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Credits used this month:</span>
              <span className="font-semibold text-gray-800">45 credits</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.EMPLOYER_DASHBOARD}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-lg transition-all
              ${isActive
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
              }
              ${collapsed && 'justify-center px-0'}
            `}
            title={collapsed ? item.label : ''}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </div>
            {!collapsed && item.badge && (
              <Badge variant={item.badge === 'Pro' ? 'default' : 'outline'} className={`
                ${item.badge === 'Pro' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                ${item.badge === 'New' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                ${typeof item.badge === 'string' && !isNaN(Number(item.badge)) ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
              `}>
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Simulations</span>
              <span className="font-semibold text-gray-800">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Candidates Today</span>
              <span className="font-semibold text-gray-800">24</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg. Response Time</span>
              <span className="font-semibold text-green-600">2.4s</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      {onCollapse && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className={`w-full justify-center ${collapsed ? 'px-0' : ''}`}
            onClick={onCollapse}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <LayoutDashboard size={20} />
            ) : (
              'Collapse Sidebar'
            )}
          </Button>
        </div>
      )}
    </aside>
  );
};

export default EmployerSidebar;