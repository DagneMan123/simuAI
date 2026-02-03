import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Zap,  Award, TrendingUp, ChevronDown, 
  Menu, X,  Star, Target, Battery, Signal, Wifi, LogOut, User, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

interface CandidateNavbarProps {
  onSearch?: (query: string) => void;
  onNextTest?: () => void;
  points?: number;
  profileScore?: number;
  streak?: number;
  upcomingTests?: Array<{
    id: string;
    title: string;
    time: string;
    company: string;
  }>;
}

const CandidateNavbar: React.FC<CandidateNavbarProps> = ({
  onSearch,
  onNextTest,
  points = 1250,
  profileScore = 75,
  streak = 7,
  upcomingTests = [
    { id: '1', title: 'Frontend Developer', time: 'Tomorrow, 10:00 AM', company: 'TechCorp' },
    { id: '2', title: 'React Assessment', time: 'In 2 days', company: 'StartupXYZ' },
  ]
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search Debouncing: ተጠቃሚው ጽፎ ሲያቆም ብቻ ፍለጋውን እንዲያከናውን
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

  const stats = [
    { label: 'Profile Score', value: `${profileScore}%`, icon: <Star className="h-4 w-4" />, color: 'text-green-600' },
    { label: 'Learning Streak', value: `${streak} days`, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
    { label: 'Points', value: points.toLocaleString(), icon: <Award className="h-4 w-4" />, color: 'text-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or assessments..."
                className="pl-10 h-10 bg-gray-50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {/* Points Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-purple-100 hover:bg-purple-50">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="font-bold text-gray-700">{points}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3">
                <DropdownMenuLabel>Points Breakdown</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-3 py-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Rank: Silver</span>
                    <span>{points}/5000 XP</span>
                  </div>
                  <Progress value={(points / 5000) * 100} className="h-1.5" />
                  <Button variant="link" size="sm" className="w-full text-purple-600 text-xs p-0 h-auto" onClick={() => navigate('/candidate/achievements')}>
                    View Leaderboard <Target size={12} className="ml-1" />
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-1 pr-2 hover:bg-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user?.firstName?.charAt(0) || 'C'}
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.CANDIDATE_PROFILE)} className="cursor-pointer">
                  <User size={16} className="mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/candidate/settings')} className="cursor-pointer">
                  <Settings size={16} className="mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut size={16} className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {upcomingTests.length > 0 && (
              <Button onClick={onNextTest} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md">
                <Zap size={16} className="mr-2" /> Next Test
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white border-gray-100 text-[10px]">
                {index === 0 ? 'Top 15%' : index === 1 ? '🔥 Streak' : 'Daily Goal'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Status Bar */}
      <div className="px-6 py-1.5 bg-gray-50/80 border-t border-gray-100 backdrop-blur-sm">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Signal size={12} className="text-green-500" />
              <span>Network: Excellent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} className="text-blue-500" />
              <span>Latency: 12ms</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded">
            <Battery size={12} />
            <span>AI Proctoring: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CandidateNavbar;