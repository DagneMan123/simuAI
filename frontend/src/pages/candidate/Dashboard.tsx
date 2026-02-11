import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  Calendar, 
  Award, 
  AlertCircle, 
  Play, 
  CheckCircle, 
  Hourglass,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { candidateApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate, formatDuration } from '@/lib/utils'

interface CandidateSimulation {
  id: string
  status: 'INVITED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
  startedAt: string
  completedAt: string | null
  timeSpent: number | null
  simulation: {
    id: string
    title: string
    description: string
    duration: number
    employer: {
      company: string
    }
  }
}

const CandidateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active')

  const { data: simulations, isLoading } = useQuery({
    queryKey: ['candidate-simulations'],
    queryFn: async () => {
      const response = await candidateApi.getSimulations()
      // Backend returns { success: true, data: [...], pagination: {...} }
      return (response.data.data || []) as CandidateSimulation[]
    }
  })

  const activeSimulations = simulations?.filter(s => 
    s.status === 'INVITED' || s.status === 'IN_PROGRESS'
  ) || []

  const completedSimulations = simulations?.filter(s => 
    s.status === 'COMPLETED'
  ) || []

  const expiredSimulations = simulations?.filter(s => 
    s.status === 'EXPIRED'
  ) || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INVITED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Invited</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case 'EXPIRED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'INVITED':
        return <Hourglass className="h-5 w-5 text-blue-500" />
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'EXPIRED':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">My Assessments</h1>
          <p className="text-slate-600 mt-2">
            Track and complete your skill assessment simulations
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-slate-900">{simulations?.length || 0}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active</p>
                  <p className="text-2xl font-bold text-slate-900">{activeSimulations.length}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 p-3 shadow-lg shadow-yellow-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{completedSimulations.length}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg shadow-green-500/30">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-slate-900">--</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-3 shadow-lg shadow-purple-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-md">
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              Active ({activeSimulations.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              Completed ({completedSimulations.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-rose-600 data-[state=active]:text-white">
              Expired ({expiredSimulations.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : activeSimulations.length === 0 ? (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                    <Hourglass className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">No active assessments</h3>
                  <p className="mb-4 text-slate-600">
                    You don't have any active assessments right now. Check back later for new invitations.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeSimulations.map((sim) => (
                  <Card key={sim.id} className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(sim.status)}
                            <h3 className="font-semibold">{sim.simulation.title}</h3>
                            {getStatusBadge(sim.status)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {sim.simulation.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Started {formatDate(sim.startedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(sim.simulation.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {sim.simulation.employer.company}
                            </div>
                          </div>
                          
                          {sim.status === 'IN_PROGRESS' && sim.timeSpent && (
                            <div className="pt-2">
                              <div className="mb-1 flex justify-between text-sm text-slate-600">
                                <span>Time Spent</span>
                                <span>{Math.floor(sim.timeSpent / 60)}m {sim.timeSpent % 60}s</span>
                              </div>
                              <Progress 
                                value={(sim.timeSpent / (sim.simulation.duration * 60)) * 100} 
                                className="h-2 bg-slate-200"
                              />
                            </div>
                          )}
                        </div>
                        
                        <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30">
                          <Link to={`/simulations/${sim.simulation.id}`}>
                            {sim.status === 'INVITED' ? 'Start Assessment' : 'Continue'}
                            <Play className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed">
            {completedSimulations.length === 0 ? (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">No completed assessments</h3>
                  <p className="mb-4 text-slate-600">
                    Complete an assessment to see your results here.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                    <Link to="/dashboard">View Active Assessments</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedSimulations.map((sim) => (
                  <Card key={sim.id} className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{sim.simulation.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Completed {sim.completedAt && formatDate(sim.completedAt)}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Time Taken</p>
                            <p className="text-2xl font-bold">
                              {sim.timeSpent ? `${Math.floor(sim.timeSpent / 60)}m ${sim.timeSpent % 60}s` : '--'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Out of {sim.simulation.duration} minutes
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Status</p>
                            <p className="text-2xl font-bold">Under Review</p>
                            <p className="text-xs text-muted-foreground">
                              Employer will contact you soon
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-lg font-semibold">{sim.simulation.employer.company}</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          View Detailed Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Expired Tab */}
          <TabsContent value="expired">
            {expiredSimulations.length === 0 ? (
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                    <AlertCircle className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">No expired assessments</h3>
                  <p className="mb-4 text-slate-600">
                    All your assessments are up to date.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {expiredSimulations.map((sim) => (
                  <Card key={sim.id} className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h3 className="font-semibold">{sim.simulation.title}</h3>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Expired
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            This assessment expired. Please contact the employer if you believe this is an error.
                          </p>
                          
                          <div className="text-sm text-muted-foreground">
                            <p>Company: {sim.simulation.employer.company}</p>
                            <p>Duration: {formatDuration(sim.simulation.duration)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CandidateDashboard