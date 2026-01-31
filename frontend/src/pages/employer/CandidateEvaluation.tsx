import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  User,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Send,
  MoreVertical,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Award,
  AlertTriangle,
  Filter,
  Search,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react'
import { simulationApi, aiApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import EmptyState from '@/components/EmptyState'

interface CandidateSubmission {
  id: string
  userId: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  stepId: string
  step: {
    title: string
    type: string
  }
  content: any
  aiFeedback: any
  score: number | null
  completedAt: string
  integrityFlags: string[]
  employerNotes?: string
  employerRating?: number
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
}

interface RubricCriteria {
  name: string
  description: string
  weight: number
  score?: number
  feedback?: string
}

const CandidateEvaluation: React.FC = () => {
  const { id, submissionId } = useParams<{ id: string; submissionId?: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSubmission, setSelectedSubmission] = useState<CandidateSubmission | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [ratings, setRatings] = useState<RubricCriteria[]>([
    { name: 'Technical Skills', description: 'Demonstrated technical knowledge', weight: 0.4 },
    { name: 'Problem Solving', description: 'Analytical thinking and solution quality', weight: 0.3 },
    { name: 'Communication', description: 'Clarity and effectiveness', weight: 0.2 },
    { name: 'Adaptability', description: 'Response to challenges', weight: 0.1 },
  ])
  const [bulkActions, setBulkActions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch submissions for this simulation
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', id],
    queryFn: async () => {
      const response = await simulationApi.getSubmissions(id!)
      return response.data as CandidateSubmission[]
    },
    enabled: !!id
  })

  // Fetch specific submission details
  const { data: submissionDetails } = useQuery({
    queryKey: ['submission-details', submissionId],
    queryFn: async () => {
      if (!submissionId) return null
      const response = await simulationApi.getSubmissionDetails(submissionId)
      return response.data as CandidateSubmission
    },
    enabled: !!submissionId
  })

  // AI evaluation mutation
  const evaluateMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const submission = submissions?.find(s => s.id === submissionId)
      if (!submission) throw new Error('Submission not found')
      
      const response = await aiApi.evaluate({
        submission: submission.content,
        rubric: ratings,
        expectedOutput: null // Would come from simulation settings
      })
      
      return response.data
    },
    onSuccess: (data, submissionId) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', id] })
      toast({
        title: 'AI Evaluation Complete',
        description: 'Submission has been evaluated by AI',
        variant: 'default',
      })
    },
    onError: () => {
      toast({
        title: 'Evaluation Failed',
        description: 'AI evaluation could not be completed',
        variant: 'destructive',
      })
    }
  })

  // Update submission status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ submissionId, status }: { submissionId: string; status: string }) => {
      await simulationApi.updateSubmissionStatus(submissionId, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', id] })
      toast({
        title: 'Status Updated',
        description: 'Candidate status has been updated',
        variant: 'default',
      })
    }
  })

  // Send feedback mutation
  const sendFeedbackMutation = useMutation({
    mutationFn: async ({ submissionId, feedback }: { submissionId: string; feedback: string }) => {
      await simulationApi.sendFeedback(submissionId, feedback)
    },
    onSuccess: () => {
      setShowFeedbackDialog(false)
      setFeedback('')
      toast({
        title: 'Feedback Sent',
        description: 'Feedback has been sent to candidate',
        variant: 'default',
      })
    }
  })

  const handleBulkAction = (action: string) => {
    if (bulkActions.length === 0) {
      toast({
        title: 'No candidates selected',
        description: 'Please select candidates first',
        variant: 'destructive',
      })
      return
    }

    switch (action) {
      case 'shortlist':
        bulkActions.forEach(subId => {
          updateStatusMutation.mutate({ submissionId: subId, status: 'shortlisted' })
        })
        break
      case 'reject':
        bulkActions.forEach(subId => {
          updateStatusMutation.mutate({ submissionId: subId, status: 'rejected' })
        })
        break
      case 'request-ai-evaluation':
        bulkActions.forEach(subId => {
          evaluateMutation.mutate(subId)
        })
        break
    }

    setBulkActions([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-600'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const calculateOverallScore = () => {
    const scoredCriteria = ratings.filter(r => r.score !== undefined)
    if (scoredCriteria.length === 0) return 0
    
    return scoredCriteria.reduce((total, criteria) => {
      return total + (criteria.score! * criteria.weight)
    }, 0)
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

  const currentSubmission = selectedSubmission || submissionDetails
  const overallScore = calculateOverallScore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Candidate Evaluation</h1>
              <p className="text-muted-foreground">
                Review and evaluate candidate submissions
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('shortlist')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Shortlist Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('reject')}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('request-ai-evaluation')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    AI Evaluate Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Candidate List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Candidates ({submissions?.length || 0})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-10 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  Click on a candidate to review their submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {submissions?.map((submission) => (
                    <Card
                      key={submission.id}
                      className={cn(
                        'cursor-pointer hover:border-primary transition-colors',
                        currentSubmission?.id === submission.id && 'border-primary bg-primary/5',
                        bulkActions.includes(submission.id) && 'border-blue-500 bg-blue-50'
                      )}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {submission.user 
                                    ? `${submission.user.firstName} ${submission.user.lastName}`
                                    : 'Anonymous Candidate'
                                  }
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {submission.user?.email || 'No email'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {getStatusBadge(submission.status)}
                              {submission.score !== null && (
                                <Badge className={getScoreColor(submission.score)}>
                                  {submission.score.toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(submission.completedAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={bulkActions.includes(submission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkActions([...bulkActions, submission.id])
                                } else {
                                  setBulkActions(bulkActions.filter(id => id !== submission.id))
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSubmission(submission)
                                setActiveTab('details')
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Evaluation Panel */}
          <div className="lg:col-span-2">
            {currentSubmission ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="submission">Submission</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Candidate Overview</CardTitle>
                      <CardDescription>
                        Basic information and performance summary
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Candidate Information
                            </h3>
                            <div className="mt-2 space-y-2">
                              <p className="font-medium">
                                {currentSubmission.user 
                                  ? `${currentSubmission.user.firstName} ${currentSubmission.user.lastName}`
                                  : 'Anonymous Candidate'
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {currentSubmission.user?.email || 'No email provided'}
                              </p>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Submitted {formatDate(currentSubmission.completedAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Assessment Details
                            </h3>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Step</span>
                                <Badge variant="outline">
                                  {currentSubmission.step.title}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Type</span>
                                <Badge variant="secondary">
                                  {currentSubmission.step.type.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Integrity Flags</span>
                                <Badge variant={
                                  currentSubmission.integrityFlags.length > 0 ? 'destructive' : 'outline'
                                }>
                                  {currentSubmission.integrityFlags.length} flags
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Score Summary
                            </h3>
                            <div className="mt-4 space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Overall Score</span>
                                  <span className={`text-lg font-bold ${getScoreColor(currentSubmission.score)}`}>
                                    {currentSubmission.score?.toFixed(1) || '--'}%
                                  </span>
                                </div>
                                <Progress 
                                  value={currentSubmission.score || 0} 
                                  className="h-2"
                                />
                              </div>

                              {currentSubmission.aiFeedback && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">AI Assessment</h4>
                                  <div className="rounded-lg border p-3">
                                    <p className="text-sm">
                                      {currentSubmission.aiFeedback.summary || 'AI evaluation available'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Manage this candidate's application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => updateStatusMutation.mutate({
                            submissionId: currentSubmission.id,
                            status: 'shortlisted'
                          })}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Shortlist Candidate
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => updateStatusMutation.mutate({
                            submissionId: currentSubmission.id,
                            status: 'rejected'
                          })}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject Candidate
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => evaluateMutation.mutate(currentSubmission.id)}
                          disabled={evaluateMutation.isPending}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          {evaluateMutation.isPending ? 'Evaluating...' : 'AI Evaluate'}
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => setShowFeedbackDialog(true)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Submission Tab */}
                <TabsContent value="submission">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Content</CardTitle>
                      <CardDescription>
                        Review the candidate's work
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-2 text-sm font-medium">Step Instructions</h3>
                          <div className="rounded-lg border p-4">
                            <p className="whitespace-pre-wrap">
                              {currentSubmission.step.type === 'AI_CHAT' 
                                ? 'AI Conversation Assessment'
                                : 'Review the candidate\'s submission below'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 text-sm font-medium">Candidate's Response</h3>
                          <div className="rounded-lg border p-4">
                            {currentSubmission.step.type === 'AI_CHAT' ? (
                              <div className="space-y-4">
                                {currentSubmission.content.messages?.map((msg: any, index: number) => (
                                  <div
                                    key={index}
                                    className={`rounded-lg p-3 ${
                                      msg.role === 'user'
                                        ? 'bg-primary/10 ml-8'
                                        : 'bg-muted mr-8'
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                ))}
                              </div>
                            ) : currentSubmission.step.type === 'CODE_REVIEW' ? (
                              <pre className="whitespace-pre-wrap font-mono text-sm">
                                {currentSubmission.content.code || 'No code submitted'}
                              </pre>
                            ) : (
                              <p className="whitespace-pre-wrap">
                                {currentSubmission.content.document || 'No document submitted'}
                              </p>
                            )}
                          </div>
                        </div>

                        {currentSubmission.aiFeedback && (
                          <div>
                            <h3 className="mb-2 text-sm font-medium">AI Analysis</h3>
                            <div className="rounded-lg border p-4">
                              <pre className="whitespace-pre-wrap text-sm">
                                {JSON.stringify(currentSubmission.aiFeedback, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Evaluation Tab */}
                <TabsContent value="evaluation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manual Evaluation</CardTitle>
                      <CardDescription>
                        Score the candidate based on the rubric
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {ratings.map((criteria, index) => (
                          <div key={index} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{criteria.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {criteria.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">
                                  {criteria.score?.toFixed(0) || '--'}%
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Weight: {(criteria.weight * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Slider
                                value={[criteria.score || 0]}
                                onValueChange={([value]) => {
                                  const newRatings = [...ratings]
                                  newRatings[index].score = value
                                  setRatings(newRatings)
                                }}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Poor</span>
                                <span>Average</span>
                                <span>Excellent</span>
                              </div>
                            </div>

                            <Textarea
                              placeholder="Add specific feedback for this criteria..."
                              value={criteria.feedback || ''}
                              onChange={(e) => {
                                const newRatings = [...ratings]
                                newRatings[index].feedback = e.target.value
                                setRatings(newRatings)
                              }}
                              rows={2}
                            />
                          </div>
                        ))}

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Overall Score</h3>
                              <p className="text-sm text-muted-foreground">
                                Weighted average of all criteria
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                                {overallScore.toFixed(1)}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Based on rubric evaluation
                              </div>
                            </div>
                          </div>
                          <Progress value={overallScore} className="mt-4 h-2" />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Save Draft</Button>
                          <Button>Submit Evaluation</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12">
                  <EmptyState
                    icon={Eye}
                    title="Select a Candidate"
                    description="Choose a candidate from the list to begin evaluation"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Feedback to Candidate</DialogTitle>
              <DialogDescription>
                Provide constructive feedback that will be sent to the candidate
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Message</Label>
                <Textarea
                  id="feedback"
                  placeholder="Enter your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Switch id="include-score" />
                  <Label htmlFor="include-score" className="cursor-pointer">
                    Include overall score
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="allow-response" />
                  <Label htmlFor="allow-response" className="cursor-pointer">
                    Allow candidate response
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (currentSubmission) {
                    sendFeedbackMutation.mutate({
                      submissionId: currentSubmission.id,
                      feedback
                    })
                  }
                }}
                disabled={!feedback.trim() || sendFeedbackMutation.isPending}
              >
                {sendFeedbackMutation.isPending ? 'Sending...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CandidateEvaluation