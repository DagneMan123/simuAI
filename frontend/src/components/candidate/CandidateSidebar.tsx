import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Bell,
  Shield,
  Star,
  Calendar,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/constants/routes';

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

  return (
    <aside className={`h-full bg-white border-r border-gray-200 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">SimuAI</h1>
              <p className="text-xs text-gray-500">Candidate Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Score */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Profile Score</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {profileScore}%
            </Badge>
          </div>
          <Progress value={profileScore} className="h-2 mb-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Upcoming Tests</span>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {upcomingTests}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-medium">8</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Rank</span>
            </div>
            <span className="text-sm font-medium">Top 15%</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.CANDIDATE_DASHBOARD}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-lg transition-all relative
              ${isActive
                ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
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
            {!collapsed && item.notification > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {item.notification}
              </Badge>
            )}
            {collapsed && item.notification > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Banner */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Premium Features</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Unlock advanced analytics and priority support
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
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

export default CandidateSidebar;