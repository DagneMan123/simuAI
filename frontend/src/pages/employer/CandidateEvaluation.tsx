import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input' // Fixed missing import
import { Slider } from '@/components/ui/slider' // Fixed missing import

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  BarChart3,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Search,
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
  
  const evaluateMutation = useMutation({
    mutationFn: async (subId: string) => {
      const submission = submissions?.find(s => s.id === subId)
      if (!submission) throw new Error('Submission not found')
      
      const response = await aiApi.evaluate({
        submission: submission.content,
        rubric: ratings,
        expectedOutput: null 
      })
      
      return response.data
    },
    onSuccess: () => { // Fixed unused variables (data, submissionId)
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

  // Filter logic for candidates list
  const filteredSubmissions = submissions?.filter(sub => {
    const fullName = `${sub.user?.firstName} ${sub.user?.lastName}`.toLowerCase()
    const email = sub.user?.email.toLowerCase() || ''
    return fullName.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
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
                      onChange={(e) => setSearchQuery(e.target.value)} // Fixed (e) underlined error
                    />
                  </div>
                </div>
                <CardDescription>
                  Click on a candidate to review their submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {filteredSubmissions?.map((submission) => (
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
                                <p className="font-medium text-sm">
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
                            
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
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
                                setActiveTab('submission')
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredSubmissions?.length === 0 && (
                     <p className="text-center text-sm text-muted-foreground py-4">No candidates found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {currentSubmission ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="submission">Submission</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Candidate Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Information</h3>
                            <div className="mt-2">
                              <p className="font-medium text-lg">
                                {currentSubmission.user 
                                  ? `${currentSubmission.user.firstName} ${currentSubmission.user.lastName}`
                                  : 'Anonymous'
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">{currentSubmission.user?.email}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Assessment</h3>
                            <div className="mt-2 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Step:</span>
                                <Badge variant="outline">{currentSubmission.step.title}</Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Integrity:</span>
                                <Badge variant={currentSubmission.integrityFlags.length > 0 ? 'destructive' : 'outline'}>
                                  {currentSubmission.integrityFlags.length} flags
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Score Summary</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Overall</span>
                              <span className={`text-lg font-bold ${getScoreColor(currentSubmission.score)}`}>
                                {currentSubmission.score?.toFixed(1) || '--'}%
                              </span>
                            </div>
                            <Progress value={currentSubmission.score || 0} className="h-2" />
                          </div>
                          {currentSubmission.aiFeedback?.summary && (
                            <div className="rounded-lg border p-3 bg-muted/30">
                              <p className="text-xs italic">{currentSubmission.aiFeedback.summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Button variant="outline" className="justify-start" onClick={() => updateStatusMutation.mutate({ submissionId: currentSubmission.id, status: 'shortlisted' })}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Shortlist
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => updateStatusMutation.mutate({ submissionId: currentSubmission.id, status: 'rejected' })}>
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button variant="outline" className="justify-start" disabled={evaluateMutation.isPending} onClick={() => evaluateMutation.mutate(currentSubmission.id)}>
                          <BarChart3 className="mr-2 h-4 w-4" /> {evaluateMutation.isPending ? 'Evaluating...' : 'AI Evaluate'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => setShowFeedbackDialog(true)}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Send Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="submission">
                  <Card>
                    <CardHeader><CardTitle>Review Content</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {currentSubmission.step.type === 'AI_CHAT' ? (
                          <div className="space-y-4">
                            {currentSubmission.content.messages?.map((msg: any, idx: number) => (
                              <div key={idx} className={cn("p-3 rounded-lg text-sm", msg.role === 'user' ? "bg-primary/10 ml-8" : "bg-muted mr-8")}>
                                <p className="font-semibold text-[10px] uppercase mb-1">{msg.role}</p>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border p-4 bg-muted/20">
                             <pre className="whitespace-pre-wrap text-sm font-mono">{JSON.stringify(currentSubmission.content, null, 2)}</pre>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="evaluation">
                  <Card>
                    <CardHeader><CardTitle>Manual Rubric</CardTitle></CardHeader>
                    <CardContent className="space-y-8">
                      {ratings.map((criteria, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="font-bold">{criteria.name}</Label>
                            <Badge variant="secondary">{criteria.score || 0}%</Badge>
                          </div>
                          {/* Fixed Slider Syntax and ([value]) error */}
                          <Slider
                            value={[criteria.score || 0]}
                            onValueChange={([val]) => {
                              const newRatings = [...ratings]
                              newRatings[index].score = val
                              setRatings(newRatings)
                            }}
                            max={100}
                            step={5}
                          />
                          <Textarea 
                            placeholder="Comments..." 
                            value={criteria.feedback || ''}
                            onChange={(e) => {
                              const newRatings = [...ratings]
                              newRatings[index].feedback = e.target.value
                              setRatings(newRatings)
                            }}
                          />
                        </div>
                      ))}
                      <div className="border-t pt-6">
                         <div className="flex justify-between items-center mb-2">
                           <span className="font-bold">Total Score:</span>
                           <span className="text-2xl font-black">{overallScore.toFixed(1)}%</span>
                         </div>
                         <Progress value={overallScore} className="h-3" />
                      </div>
                      <div className="flex justify-end gap-2">
                         <Button variant="outline">Save Progress</Button>
                         <Button>Finalize Grade</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="feedback">
                  <Card>
                    <CardContent className="p-12">
                      <EmptyState icon={MessageSquare} title="Feedback History" description="No previous messages found." />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12">
                  <EmptyState icon={Eye} title="Select a Candidate" description="Choose a candidate from the left panel to begin." />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Direct Feedback</DialogTitle>
              <DialogDescription>Sent to the candidate's dashboard.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={6} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label>Include Score</Label>
                <Switch id="include-score" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
              <Button onClick={() => currentSubmission && sendFeedbackMutation.mutate({ submissionId: currentSubmission.id, feedback })} disabled={!feedback.trim() || sendFeedbackMutation.isPending}>
                {sendFeedbackMutation.isPending ? 'Sending...' : 'Send Now'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CandidateEvaluation