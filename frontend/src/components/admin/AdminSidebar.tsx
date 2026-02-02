import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Shield,
  Database,
  Building,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface AdminSidebarProps {
  collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const navItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: ROUTES.ADMIN_USERS, icon: <Users size={20} />, label: 'User Management' },
    { path: ROUTES.ADMIN_SYSTEM_LOGS, icon: <Database size={20} />, label: 'System Logs' },
    { path: ROUTES.ADMIN_VERIFICATION, icon: <Shield size={20} />, label: 'Verification' },
    { path: '/admin/companies', icon: <Building size={20} />, label: 'Companies' },
    { path: ROUTES.ADMIN_ANALYTICS, icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: ROUTES.ADMIN_REPORTS, icon: <FileText size={20} />, label: 'Reports' },
    { path: '/admin/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: ROUTES.ADMIN_SETTINGS, icon: <Settings size={20} />, label: 'Settings' },
    { path: '/admin/support', icon: <HelpCircle size={20} />, label: 'Support' },
  ];

  return (
    <aside className={`h-full bg-white border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">SimuAI Admin</h1>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.ADMIN_DASHBOARD}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
              }
              ${collapsed && 'justify-center'}
            `}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-gray-700 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600">All Systems Operational</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;