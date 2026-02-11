import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Briefcase,
  BarChart3,
  Server,
  Shield,
  Settings,
  UserPlus,
  TrendingUp,
  Database,
  Activity,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import Navbar from '@/components/Navbar'
import { api } from '@/lib/api'

// Define interfaces to avoid 'any' issues
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  isVerified: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalSimulations: number;
  activeSessions: number;
  totalSubmissions: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats')
      return response.data
    }
  })

  const { data: userData, isLoading: usersLoading } = useQuery<{ users: User[] }>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users?limit=10')
      return response.data
    }
  })

  const growthData = [
    { month: 'Jan', users: 120, simulations: 45 },
    { month: 'Feb', users: 180, simulations: 68 },
    { month: 'Mar', users: 240, simulations: 92 },
    { month: 'Apr', users: 320, simulations: 128 },
    { month: 'May', users: 410, simulations: 165 },
    { month: 'Jun', users: 520, simulations: 210 }
  ]

  const roleDistribution = [
    { name: 'Employers', value: 65, color: '#3b82f6' },
    { name: 'Candidates', value: 30, color: '#8b5cf6' },
    { name: 'Admins', value: 5, color: '#10b981' }
  ]

  // Fixed: performanceData is now used in the Overview tab
  const performanceData = [
    { name: 'Success Rate', value: 95 },
    { name: 'Avg Score', value: 78 },
    { name: 'Completion', value: 85 },
    { name: 'Satisfaction', value: 92 }
  ]

  const systemHealth = {
    cpu: 45,
    memory: 68,
    storage: 82,
    uptime: '99.9%'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-orange-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-slate-600 mt-2">System overview and administration</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-300 hover:bg-white/80">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 shadow-lg shadow-rose-500/30">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 p-3 shadow-lg shadow-blue-500/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+12% </span>
                <span className="text-slate-600 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Simulations</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalSimulations || 0}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-3 shadow-lg shadow-purple-500/30">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-600">
                {stats?.activeSessions || 0} active sessions
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Submissions</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalSubmissions || 0}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg shadow-green-500/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={85} className="h-2 bg-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">System Health</p>
                  <p className="text-2xl font-bold text-slate-900">{systemHealth.uptime}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg shadow-orange-500/30">
                  <Server className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-600">All systems operational</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-orange-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="simulations" stroke="#8b5cf6" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Added: performanceData usage here to remove the warning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {performanceData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-bold">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Input
                    placeholder="Search users..."
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData?.users?.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={(user.role === 'ADMIN' ? 'destructive' : user.role === 'EMPLOYER' ? 'default' : 'secondary') as "default" | "destructive" | "secondary" | "outline"}>
                              {user.role}
                            </Badge>
                            <Badge variant={(user.isVerified ? 'outline' : 'destructive') as "outline" | "destructive" | "default" | "secondary"}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </Badge>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{systemHealth.cpu}%</span>
                    </div>
                    <Progress value={systemHealth.cpu} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{systemHealth.memory}%</span>
                    </div>
                    <Progress value={systemHealth.memory} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>SSL Encryption</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span>Backups</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Daily</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard