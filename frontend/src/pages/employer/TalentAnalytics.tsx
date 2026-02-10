import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  Award,
  DollarSign,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  RadarIcon,
  LineChart as LineChartIcon,
  RefreshCw
} from 'lucide-react'
import { simulationApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  date: string
  candidates: number
  avgScore: number
  completionRate: number
  shortlisted: number
}

interface DiversityData {
  category: string
  count: number
  percentage: number
  target: number
}

interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  gap: number
  priority: 'high' | 'medium' | 'low'
}

interface PieChartData {
  name: string
  value: number
}

const TalentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeChart, setActiveChart] = useState('bar')
  const [simulationFilter, setSimulationFilter] = useState('all')

  const { refetch, isFetching, data: analyticsData } = useQuery({
    queryKey: ['analyticsData', timeRange, simulationFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeRange,
        simulation: simulationFilter
      })
      const response = await simulationApi.getAnalytics(`?${params}`)
      return response.data
    },
  })

  // Use actual data from API
  const performanceData = analyticsData?.performanceData || []
  const diversityData = analyticsData?.diversityData || []
  const skillGaps = analyticsData?.skillGaps || []
  const pieChartData = analyticsData?.pieChartData || []
  const hiringMetrics = analyticsData?.hiringMetrics || {
    timeToHire: 0,
    costPerHire: 0,
    qualityOfHire: 0,
    offerAcceptanceRate: 0,
    candidateExperience: 0,
    diversityScore: 0
  }
  const topPerformers = analyticsData?.topPerformers || []

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const exportReport = () => {
    console.log('Exporting analytics report...')
  }

  const refreshData = () => {
    refetch()
    console.log('Refreshing analytics data...')
  }

  // Custom renderLabel function with proper typing
  const renderLabel = (entry: any) => {
    const percent = entry.percent || 0;
    const name = entry.name || '';
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  // Custom renderLabel function for PieChart
  const renderPieLabel = (entry: any) => {
    const percent = entry.percent || 0;
    const name = entry.name || '';
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900")}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Talent Analytics</h1>
              <p className="text-muted-foreground">
                Data-driven insights for better hiring decisions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
                Refresh
              </Button>
              <Button onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Simulation</label>
                <Select value={simulationFilter} onValueChange={setSimulationFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Simulations</SelectItem>
                    <SelectItem value="senior-dev">Senior Developer</SelectItem>
                    <SelectItem value="frontend">Frontend Engineer</SelectItem>
                    <SelectItem value="backend">Backend Engineer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Chart Type</label>
                <div className="flex gap-2">
                  <Button
                    variant={activeChart === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveChart('bar')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeChart === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveChart('line')}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeChart === 'pie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveChart('pie')}
                  >
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeChart === 'radar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveChart('radar')}
                  >
                    <RadarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold">147</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold">82.5%</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={82.5} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time to Hire</p>
                  <p className="text-2xl font-bold">{hiringMetrics.timeToHire}d</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Industry avg: 34d</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cost per Hire</p>
                  <p className="text-2xl font-bold">${hiringMetrics.costPerHire.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                  <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">-$1,200 </span>
                  <span className="text-muted-foreground ml-2">saved</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quality of Hire</p>
                  <p className="text-2xl font-bold">{hiringMetrics.qualityOfHire}/10</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={hiringMetrics.qualityOfHire * 10} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diversity Score</p>
                  <p className="text-2xl font-bold">{hiringMetrics.diversityScore}/10</p>
                </div>
                <div className="rounded-lg bg-pink-100 p-3 dark:bg-pink-900">
                  <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={hiringMetrics.diversityScore * 10} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
            <TabsTrigger value="diversity">Diversity Analytics</TabsTrigger>
            <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
          </TabsList>

          {/* Performance Trends */}
          <TabsContent value="performance">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Hiring Performance Trends</CardTitle>
                  <CardDescription>
                    Key metrics over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {activeChart === 'bar' ? (
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="candidates" fill="#3b82f6" name="Candidates" />
                          <Bar yAxisId="right" dataKey="avgScore" fill="#10b981" name="Avg Score" />
                          <Bar yAxisId="left" dataKey="shortlisted" fill="#8b5cf6" name="Shortlisted" />
                        </BarChart>
                      ) : activeChart === 'line' ? (
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="candidates" stroke="#3b82f6" />
                          <Line type="monotone" dataKey="avgScore" stroke="#10b981" />
                          <Line type="monotone" dataKey="completionRate" stroke="#8b5cf6" />
                        </LineChart>
                      ) : activeChart === 'pie' ? (
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <RadarChart data={performanceData.slice(0, 4)}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="date" />
                          <PolarRadiusAxis />
                          <Radar name="Candidates" dataKey="candidates" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                          <Radar name="Avg Score" dataKey="avgScore" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        </RadarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>
                    Assessment completion by simulation type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderPieLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>
                    How candidates performed overall
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">90-100% (Excellent)</span>
                        <span className="font-semibold">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">75-89% (Good)</span>
                        <span className="font-semibold">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">60-74% (Average)</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Below 60% (Needs Work)</span>
                        <span className="font-semibold">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Diversity Analytics */}
          <TabsContent value="diversity">
            <Card>
              <CardHeader>
                <CardTitle>Diversity & Inclusion Metrics</CardTitle>
                <CardDescription>
                  Track your progress towards inclusive hiring goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={diversityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="percentage" fill="#3b82f6" name="Current %" />
                          <Bar dataKey="target" fill="#10b981" name="Target %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Diversity Progress</h3>
                      {diversityData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{item.percentage}%</span>
                              <span className="text-sm text-muted-foreground">
                                (Target: {item.target}%)
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Progress value={item.percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Current</span>
                              <span>Target</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-semibold">Diversity Insights</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Pipeline Diversity</p>
                        <p className="text-2xl font-bold">68%</p>
                        <p className="text-sm">
                          Above industry average (52%)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Hire Diversity</p>
                        <p className="text-2xl font-bold">45%</p>
                        <p className="text-sm">
                          Improving from last quarter (38%)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Retention Rate</p>
                        <p className="text-2xl font-bold">92%</p>
                        <p className="text-sm">
                          High retention across all groups
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skill Gaps */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Identify areas where candidates need development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillGaps}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis />
                        <Radar name="Current Level" dataKey="currentLevel" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Radar name="Required Level" dataKey="requiredLevel" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Detailed Skill Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Skill</th>
                            <th className="text-left py-2">Current Level</th>
                            <th className="text-left py-2">Required Level</th>
                            <th className="text-left py-2">Gap</th>
                            <th className="text-left py-2">Priority</th>
                            <th className="text-left py-2">Recommendations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skillGaps.map((skill, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="py-3 font-medium">{skill.skill}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <Progress value={skill.currentLevel} className="w-24 h-2" />
                                  <span>{skill.currentLevel}%</span>
                                </div>
                              </td>
                              <td className="py-3">{skill.requiredLevel}%</td>
                              <td className="py-3">
                                <Badge variant={
                                  skill.gap > 25 ? 'destructive' :
                                  skill.gap > 15 ? 'outline' : 'secondary'
                                }>
                                  {skill.gap}%
                                </Badge>
                              </td>
                              <td className="py-3">
                                <Badge variant={
                                  skill.priority === 'high' ? 'destructive' :
                                  skill.priority === 'medium' ? 'default' : 'secondary'
                                }>
                                  {skill.priority}
                                </Badge>
                              </td>
                              <td className="py-3 text-sm">
                                Focus on {skill.skill} in training programs
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Performers */}
          <TabsContent value="top-performers">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Candidates</CardTitle>
                <CardDescription>
                  Your highest-scoring candidates across all assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 font-semibold">Performance Leaderboard</h3>
                      <div className="space-y-4">
                        {topPerformers.map((candidate, index) => (
                          <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <span className="font-bold">{index + 1}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold">{candidate.name}</p>
                                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className="mb-1 bg-green-100 text-green-800">
                                    {candidate.score}%
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    {candidate.status}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 font-semibold">Performance Insights</h3>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Average Top 5 Score</p>
                              <p className="text-2xl font-bold">90.4%</p>
                            </div>
                            <Award className="h-8 w-8 text-yellow-500" />
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            15% above overall average
                          </p>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Conversion Rate</p>
                              <p className="text-2xl font-bold">60%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            3 of 5 top performers hired
                          </p>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Common Skills</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                <Badge variant="outline">System Design</Badge>
                                <Badge variant="outline">Problem Solving</Badge>
                                <Badge variant="outline">Communication</Badge>
                              </div>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
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

export default TalentAnalytics