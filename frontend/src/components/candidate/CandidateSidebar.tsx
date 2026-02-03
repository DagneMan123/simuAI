import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  User,
  Award,
  Briefcase,
  Clock,
  Settings,
  HelpCircle,
  TrendingUp,
  Shield,
  Star,
  Calendar,
  BookOpen,
  Target,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Using relative paths to fix "@/" underlined errors
import { Button } from '../ui/button'; 
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';

interface CandidateSidebarProps {
  collapsed?: boolean;
  profileScore?: number;
  upcomingTests?: number;
  onCollapse?: () => void;
}

const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  collapsed = false,
  profileScore = 75,
  upcomingTests = 2,
  onCollapse
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Integrated real data from context
  const displayScore = (user as any)?.profileScore || profileScore;

  const navItems = [
    { path: ROUTES.CANDIDATE_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard', notification: 0 },
    { path: ROUTES.CANDIDATE_JOBS, icon: <Briefcase size={20} />, label: 'Find Jobs', notification: 12 },
    { path: ROUTES.CANDIDATE_MY_RESULTS, icon: <FileText size={20} />, label: 'My Results', notification: 0 },
    { path: ROUTES.CANDIDATE_PRACTICE, icon: <BookOpen size={20} />, label: 'Practice Tests', notification: 3 },
    { path: ROUTES.CANDIDATE_PROFILE, icon: <User size={20} />, label: 'My Profile', notification: 0 },
    { path: '/candidate/skills', icon: <Target size={20} />, label: 'Skill Analysis', notification: 0 },
    { path: '/candidate/calendar', icon: <Calendar size={20} />, label: 'Interview Calendar', notification: 1 },
    { path: '/candidate/achievements', icon: <Award size={20} />, label: 'Achievements', notification: 0 },
    { path: '/candidate/settings', icon: <Settings size={20} />, label: 'Settings', notification: 0 },
    { path: '/candidate/support', icon: <HelpCircle size={20} />, label: 'Help & Support', notification: 0 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* 1. Logo Section */}
      <div className="p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap className="h-6 w-6 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">SimuAI</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Candidate Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Scrollable Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Profile Score - Hidden when collapsed */}
        {!collapsed && (
          <div className="p-4 border-b bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-slate-700">Profile Score</span>
              </div>
              <Badge variant="outline" className="bg-white text-green-700 border-green-200">
                {displayScore}%
              </Badge>
            </div>
            <Progress value={displayScore} className="h-1.5 mb-2" />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
        )}

        {/* Quick Stats - Hidden when collapsed */}
        {!collapsed && (
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">Upcoming Tests</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-none px-2">
                {upcomingTests}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-slate-600">Completed</span>
              </div>
              <span className="text-sm font-bold text-slate-800">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-600">Global Rank</span>
              </div>
              <span className="text-sm font-bold text-slate-800">Top 15%</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.CANDIDATE_DASHBOARD}
              title={collapsed ? item.label : ''}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`${collapsed ? 'scale-110' : ''}`}>{item.icon}</span>
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </div>
              
              {!collapsed && item.notification > 0 && (
                <Badge variant="destructive" className="h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] border-none">
                  {item.notification}
                </Badge>
              )}
              
              {collapsed && item.notification > 0 && (
                <div className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Banner */}
        {!collapsed && (
          <div className="p-4">
            <div className="bg-slate-900 p-4 rounded-2xl relative overflow-hidden group shadow-lg">
              <Zap className="absolute -right-2 -top-2 h-16 w-16 text-white opacity-10 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-white/90">
                  <Shield size={16} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Premium</span>
                </div>
                <p className="text-slate-400 text-[11px] mb-3 leading-snug">
                  Get advanced AI analytics and priority hiring.
                </p>
                <Button size="sm" className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold border-none text-xs">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Section */}
      <div className="p-4 border-t border-gray-100 shrink-0 bg-white space-y-1">
        {/* User Identity - Hidden when collapsed */}
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
              {user.fullName?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={`w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'px-0 justify-center' : ''}`}
          onClick={handleLogout}
        >
          <LogOut size={20} className={collapsed ? "" : "mr-3"} />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-slate-400 hover:text-slate-600 ${collapsed ? 'px-0 justify-center' : ''}`}
          onClick={onCollapse}
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <div className="flex items-center gap-3">
              <ChevronLeft size={20} />
              <span className="text-xs font-medium uppercase tracking-tight">Collapse Menu</span>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default CandidateSidebar;