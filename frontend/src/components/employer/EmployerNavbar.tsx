import React, { useState } from 'react';
import { Search, Bell, Plus, Users, TrendingUp, Zap, ChevronDown, Menu, X } from 'lucide-react';
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

interface EmployerNavbarProps {
  onSearch?: (query: string) => void;
  onInviteClick?: () => void;
  onCreateSimulation?: () => void;
  credits?: number;
  notifications?: number;
  companyName?: string;
}

const EmployerNavbar: React.FC<EmployerNavbarProps> = ({
  onSearch,
  onInviteClick,
  onCreateSimulation,
  credits = 150,
  notifications = 3,
  companyName = 'Your Company'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const stats = [
    { label: 'Total Candidates', value: '245', change: '+12%' },
    { label: 'Active Simulations', value: '8', change: '+2' },
    { label: 'Hiring Rate', value: '68%', change: '+8%' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-4">
          {/* Left: Company & Search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{companyName}</h2>
                <p className="text-sm text-gray-500">Hiring Dashboard</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates, simulations, or skills..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Credits Display */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-800">{credits}</span>
                    <span className="text-gray-500">credits</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Credits Overview</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Credits</span>
                      <span className="font-semibold">{credits}</span>
                    </div>
                    <Progress value={(credits / 200) * 100} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used this month</span>
                      <span className="text-gray-800">45 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Simulation cost</span>
                      <span className="text-gray-800">5 credits each</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-blue-600 font-medium">
                  <Zap className="mr-2 h-4 w-4" />
                  Buy More Credits
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New Candidate Applied</p>
                        <p className="text-sm text-gray-500">John Doe applied for Frontend Developer</p>
                        <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Simulation Completed</p>
                        <p className="text-sm text-gray-500">React Assessment has results ready</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
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

            {/* Create Simulation Button */}
            <Button 
              onClick={onCreateSimulation}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Simulation
            </Button>

            {/* Invite Button */}
            <Button 
              variant="outline" 
              onClick={onInviteClick}
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <Users className="mr-2 h-4 w-4" />
              Invite Team
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="hidden lg:grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <Badge variant="outline" className={`
                ${stat.change.includes('+') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
              `}>
                {stat.change}
              </Badge>
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Simulation
              </Button>
              <Button variant="outline" className="w-full border-green-600 text-green-700">
                <Users className="mr-2 h-4 w-4" />
                Invite Team
              </Button>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{credits} credits</span>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default EmployerNavbar;