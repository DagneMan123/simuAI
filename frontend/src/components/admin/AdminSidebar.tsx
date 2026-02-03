import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: ROUTES.ADMIN_USERS, icon: <Users size={20} />, label: 'User Management' },
    { path: ROUTES.ADMIN_SYSTEM_LOGS, icon: <Database size={20} />, label: 'System Logs' },
    { path: ROUTES.ADMIN_VERIFICATION, icon: <Shield size={20} />, label: 'Verification', badge: 5 },
    { path: '/admin/companies', icon: <Building size={20} />, label: 'Companies' },
    { path: ROUTES.ADMIN_ANALYTICS, icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: ROUTES.ADMIN_REPORTS, icon: <FileText size={20} />, label: 'Reports' },
    { path: '/admin/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: ROUTES.ADMIN_SETTINGS, icon: <Settings size={20} />, label: 'Settings' },
    { path: '/admin/support', icon: <HelpCircle size={20} />, label: 'Support' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside 
      className={`h-screen sticky top-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">SimuAI</h1>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.ADMIN_DASHBOARD}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
            title={collapsed ? item.label : ''}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </div>
            {!collapsed && item.badge && (
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        {!collapsed && (
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-gray-500 truncate">Super Admin</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${collapsed ? 'px-2' : ''}`}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center text-gray-400"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-xs">Collapse</span></div>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;