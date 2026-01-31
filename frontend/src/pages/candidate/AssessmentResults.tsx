import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Radar,
} from 'recharts'
import {
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Eye,
  Star,
  Target,
  Users,
  Calendar
} from 'lucide-react'
import { candidateApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate, formatDuration } from '@/lib/utils'
import EmptyState from '@/components/EmptyState'

interface AssessmentResult {
  id: string
  simulationId: string
  simulationTitle: string
  companyName: string
  completedAt: string
  timeSpent: number
  overallScore: number
  status: 'passed' | 'failed' | 'pending'
  detailedFeedback: string
  skillBreakdown: {
    skill: string
    score: number
    feedback: string
  }[]
  aiFeedback?: {
    strengths: string[]
    areasForImprovement: string[]
    recommendations: string[]
  }
  comparisonData?: {
    averageScore: number
    percentile: number
    topSkills: string[]
  }
}

const AssessmentResults: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: results, isLoading } = useQuery({
    queryKey: ['assessment-results', id],
    queryFn: async () => {
      if (id) {
        const response = await candidateApi.getSimulationResults(id)
        return response.data as AssessmentResult
      }
      // Mock data for demonstration
      return {
        id: '1',
        simulationId: 'sim-123',
        simulationTitle: 'Senior Software Engineer Assessment',
        companyName: 'TechCorp Inc.',
        completedAt: new Date().toISOString(),
        timeSpent: 45 * 60, // 45 minutes in seconds
        overallScore: 85,
        status: 'passed',
        detailedFeedback: 'Excellent performance demonstrating strong technical skills and problem-solving abilities. Your communication during the system design discussion was particularly impressive.',
        skillBreakdown: [
          { skill: 'Technical Skills', score: 92, feedback: 'Strong understanding of algorithms and data structures' },
          { skill: 'Problem Solving', score: 88, feedback: 'Effective approach to complex problems' },
          { skill: 'Communication', score: 82, feedback: 'Clear and articulate explanations' },
          { skill: 'System Design', score: 90, feedback: 'Well-structured and scalable solutions' },
          { skill: 'Code Quality', score: 78, feedback: 'Good practices with room for improvement in testing' },
        ],
        aiFeedback: {
          strengths: [
            'Strong algorithmic thinking',
            'Clear communication style',
            'Good system design intuition',
            'Adaptable problem-solving approach'
          ],
          areasForImprovement: [
            'Could improve test coverage',
            'Consider edge cases more thoroughly',
            'Documentation could be more detailed'
          ],
          recommendations: [
            'Practice more complex system design problems',
            'Work on writing comprehensive tests',
            'Review design patterns for common problems'
          ]
        },
        comparisonData: {
          averageScore: 72,
          percentile: 85,
          topSkills: ['System Design', 'Algorithms', 'Communication']
        }
      } as AssessmentResult
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Passed
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Needs Improvement
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Under Review
          </Badge>
        )
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const exportResults = () => {
    const data = {
      assessment: results?.simulationTitle,
      company: results?.companyName,
      date: results?.completedAt,
      score: results?.overallScore,
      status: results?.status,
      skills: results?.skillBreakdown,
      feedback: results?.detailedFeedback
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assessment-results-${new Date().toISOString()}.json`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={AlertCircle}
            title="Results not available"
            description="The assessment results are not available yet or the assessment ID is invalid."
            actionLabel="View My Assessments"
            onAction={() => window.location.href = '/my-assessments'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
              <p className="text-muted-foreground">
                Detailed analysis of your performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportResults}>
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
              <Button asChild>
                <Link to={`/simulations/${results.simulationId}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Review Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Overall Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}%
                  </span>
                  {getStatusBadge(results.status)}
                </div>
                <Progress value={results.overallScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Time Taken</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatDuration(Math.floor(results.timeSpent / 60))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(results.timeSpent / 60)} minutes
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Completed On</span>
                </div>
                <p className="text-2xl font-bold">
                  {new Date(results.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(results.completedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Company</span>
                </div>
                <p className="text-2xl font-bold">{results.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {results.simulationTitle}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
            <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Radar</CardTitle>
                  <CardDescription>
                    Visual representation of your skill scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={results.skillBreakdown}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Your Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>
                    Key highlights from your assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-700 dark:text-green-400">
                          Strengths
                        </h3>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {results.aiFeedback?.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-600 dark:text-green-300">
                            ✓ {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                          Recommendations
                        </h3>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {results.aiFeedback?.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-blue-600 dark:text-blue-300">
                            → {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Breakdown Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>
                  Detailed breakdown of each assessed skill
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.skillBreakdown.map((skill, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <p className="text-sm text-muted-foreground">
                            {skill.feedback}
                          </p>
                        </div>
                        <Badge className={`${getScoreColor(skill.score)} bg-opacity-20`}>
                          {skill.score}%
                        </Badge>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Feedback</CardTitle>
                <CardDescription>
                  Comprehensive evaluation from our AI assessment system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <MessageSquare className="h-5 w-5" />
                      Overall Assessment
                    </h3>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {results.detailedFeedback}
                    </p>
                  </div>

                  {results.aiFeedback && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold">
                          <Award className="h-5 w-5 text-green-600" />
                          Key Strengths
                        </h3>
                        <ul className="space-y-2">
                          {results.aiFeedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {results.aiFeedback.areasForImprovement.map((area, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-yellow-500" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>
                  How you compare with other candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.comparisonData ? (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="mb-2 text-sm text-muted-foreground">
                              Your Score
                            </div>
                            <div className="text-3xl font-bold">
                              {results.overallScore}%
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              vs Average: {results.comparisonData.averageScore}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="mb-2 text-sm text-muted-foreground">
                              Percentile Rank
                            </div>
                            <div className="text-3xl font-bold">
                              {results.comparisonData.percentile}%
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Top {100 - results.comparisonData.percentile}% of candidates
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="mb-2 text-sm text-muted-foreground">
                              Top Skills
                            </div>
                            <div className="space-y-1">
                              {results.comparisonData.topSkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="mr-1">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'You', score: results.overallScore },
                            { name: 'Average', score: results.comparisonData.averageScore },
                            { name: 'Top 10%', score: 95 },
                            { name: 'Top 25%', score: 85 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="score" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Comparison data not available for this assessment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AssessmentResults