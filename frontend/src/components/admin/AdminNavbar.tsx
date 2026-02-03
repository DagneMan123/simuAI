import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  HelpCircle, 
  Menu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

interface AdminNavbarProps {
  onSearch?: (query: string) => void;
  toggleSidebar?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onSearch, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCount] = useState(3);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, onSearch]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          
          {/* Mobile Menu & Search Section */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden shrink-0" 
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </Button>
            
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search analytics, users, or logs..."
                className="pl-10 h-10 w-full bg-gray-50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action Icons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell size={20} />
                  {notificationsCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-semibold text-sm">New Employer Signup</span>
                    </div>
                    <p className="text-xs text-gray-500">TechCorp registered a new account.</p>
                    <span className="text-[10px] text-gray-400 mt-1">2 mins ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="font-semibold text-sm">System Warning</span>
                    </div>
                    <p className="text-xs text-gray-500">High API latency detected in Region A.</p>
                    <span className="text-[10px] text-gray-400 mt-1">1 hour ago</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center text-blue-600 text-xs font-bold cursor-pointer"
                  onClick={() => navigate(ROUTES.ADMIN_SYSTEM_LOGS)}
                >
                  View All Activity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-gray-100 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="font-bold text-white text-xs uppercase">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-none">
                      {user?.firstName || 'Administrator'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-medium">System Admin</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.CANDIDATE_PROFILE)} className="cursor-pointer py-2">
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.ADMIN_SETTINGS)} className="cursor-pointer py-2">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <HelpCircle className="mr-2 h-4 w-4" /> Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer py-2 font-medium">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-8 border-t pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
              Infrastructure: Operational
            </Badge>
          </div>
          <div className="text-[11px] text-gray-500">
            <span className="font-bold text-gray-700">Uptime:</span> 99.9%
          </div>
          <div className="text-[11px] text-gray-500">
            <span className="font-bold text-gray-700">Active Users:</span> 1,245
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;