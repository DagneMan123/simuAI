import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Zap, 
  Calendar, 
  Award,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  Clock,
  Star,
  Target,
  Battery,
  Signal,
  Wifi
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
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const stats = [
    { label: 'Profile Score', value: `${profileScore}%`, icon: <Star className="h-4 w-4" />, color: 'text-green-600' },
    { label: 'Learning Streak', value: `${streak} days`, icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-600' },
    { label: 'Points', value: points.toLocaleString(), icon: <Award className="h-4 w-4" />, color: 'text-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-4">
          {/* Left: Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs, tests, or companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Points Display */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-purple-50">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold text-gray-800">{points}</span>
                    <span className="text-gray-500">points</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Points Overview</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Points</span>
                      <span className="font-semibold">{points}</span>
                    </div>
                    <Progress value={(points / 5000) * 100} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Level</span>
                      <span className="text-gray-800">5000 points</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Rank</span>
                      <span className="text-gray-800">Silver</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-purple-600 font-medium">
                  <Target className="mr-2 h-4 w-4" />
                  View Leaderboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Test Scheduled</p>
                        <p className="text-sm text-gray-500">Frontend Developer test tomorrow at 10:00 AM</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New Achievement!</p>
                        <p className="text-sm text-gray-500">You earned the "Fast Learner" badge</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-blue-600">
                  View All Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Next Test Button */}
            {upcomingTests.length > 0 && (
              <Button 
                onClick={onNextTest}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Zap className="mr-2 h-4 w-4" />
                Next Test
                <Badge className="ml-2 bg-white text-green-700">1</Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                {index === 0 ? '+5%' : index === 1 ? '🔥' : '+120'}
              </Badge>
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {upcomingTests.length > 0 && (
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Take Next Test
                </Button>
              )}
              
              {/* Upcoming Tests */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Upcoming Tests</h4>
                {upcomingTests.slice(0, 2).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{test.title}</p>
                      <p className="text-xs text-gray-500">{test.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{test.time}</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Remind
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status Bar */}
      <div className="px-6 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-green-500" />
              <span className="text-gray-600">Connection: Excellent</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-blue-500" />
              <span className="text-gray-600">Latency: 28ms</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">Proctoring: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CandidateNavbar;