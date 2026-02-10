import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Target
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import Navbar from '@/components/Navbar'
import { api } from '@/lib/api'
import { formatDate, formatDuration } from '@/lib/utils'

interface Simulation {
  id: string
  title: string
  description: string
  duration: number
  isPublished: boolean
  isBlindMode: boolean
  createdAt: string
  _count: {
    invitations: number
    submissions: number
  }
}

interface Analytics {
  totalCandidates: number
  avgScore: number
  completionRate: number
  topSkills: { skill: string; score: number }[]
}

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7days')

  const { data: simulations, isLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      const response = await api.get('/simulations/employer')
      return response.data as Simulation[]
    }
  })

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/employer/analytics')
      return response.data as Analytics
    }
  })

  const performanceData = [
    { month: 'Jan', candidates: 12, avgScore: 72 },
    { month: 'Feb', candidates: 18, avgScore: 75 },
    { month: 'Mar', candidates: 24, avgScore: 78 },
    { month: 'Apr', candidates: 30, avgScore: 82 },
    { month: 'May', candidates: 28, avgScore: 85 },
    { month: 'Jun', candidates: 35, avgScore: 88 }
  ]

  const pendingActions = [
    { id: 1, type: 'review', count: 12, title: 'Submissions to Review' },
    { id: 2, type: 'invite', count: 8, title: 'Pending Invitations' },
    { id: 3, type: 'feedback', count: 5, title: 'Feedback Requests' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your hiring simulations and candidate performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/simulations/create">
                  <Plus className="mr-2 h-4 w-4" />
                  New Simulation
                </Link>
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold">{analytics?.totalCandidates || 0}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">+12% </span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{analytics?.avgScore?.toFixed(1) || 0}%</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={analytics?.avgScore || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{analytics?.completionRate?.toFixed(1) || 0}%</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Industry avg: 65%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Time Saved</p>
                  <p className="text-2xl font-bold">42h</p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Per hire vs traditional methods</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="simulations">Simulations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Candidate performance over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="candidates" fill="#3b82f6" name="Candidates" />
                      <Bar dataKey="avgScore" fill="#8b5cf6" name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Assessment</CardTitle>
                  <CardDescription>
                    Average scores by skill category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={analytics?.topSkills}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Items requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {pendingActions.map((action) => (
                    <Card key={action.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {action.title}
                            </p>
                            <p className="text-2xl font-bold">{action.count}</p>
                          </div>
                          <Badge variant={
                            action.type === 'review' ? 'default' :
                            action.type === 'invite' ? 'secondary' : 'outline'
                          }>
                            {action.type}
                          </Badge>
                        </div>
                        <Button size="sm" className="mt-4 w-full" asChild>
                          <Link to={`/${action.type}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulations Tab */}
          <TabsContent value="simulations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Simulations</CardTitle>
                    <CardDescription>
                      Create and manage your hiring assessments
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/simulations/create">
                      <Plus className="mr-2 h-4 w-4" />
                      New Simulation
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : simulations?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No simulations yet</h3>
                    <p className="mb-4 text-muted-foreground">
                      Create your first simulation to start assessing candidates
                    </p>
                    <Button asChild>
                      <Link to="/simulations/create">Create Simulation</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {simulations?.map((simulation) => (
                      <Card key={simulation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{simulation.title}</h3>
                                <Badge variant={simulation.isPublished ? 'default' : 'outline'}>
                                  {simulation.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                                {simulation.isBlindMode && (
                                  <Badge variant="secondary">Blind Mode</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {simulation.description || 'No description'}
                              </p>
                              <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(simulation.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(simulation.duration)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {simulation._count.invitations} invited
                                </div>
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="h-4 w-4" />
                                  {simulation._count.submissions} submissions
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/simulations/${simulation.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/simulations/${simulation.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Deep insights into your hiring process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Time Range Selector */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <div className="flex gap-2">
                      {['7days', '30days', '90days', '1year'].map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTimeRange(range)}
                        >
                          {range}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Diversity Metrics */}
                  <div className="rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-semibold">Diversity Analytics</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-3 font-medium">Gender Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Male</span>
                            <span className="font-semibold">54%</span>
                          </div>
                          <Progress value={54} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span>Female</span>
                            <span className="font-semibold">43%</span>
                          </div>
                          <Progress value={43} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span>Other/Prefer not to say</span>
                            <span className="font-semibold">3%</span>
                          </div>
                          <Progress value={3} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-3 font-medium">Ethnicity Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Asian</span>
                            <span className="font-semibold">32%</span>
                          </div>
                          <Progress value={32} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span>White</span>
                            <span className="font-semibold">28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span>Hispanic/Latino</span>
                            <span className="font-semibold">22%</span>
                          </div>
                          <Progress value={22} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span>Black/African American</span>
                            <span className="font-semibold">18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="flex justify-end">
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default EmployerDashboard