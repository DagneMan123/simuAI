import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart3,
  Download,
  Eye,
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Search,
} from 'lucide-react'
import { simulationApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate } from '@/lib/utils'

interface Submission {
  id: string
  userId: string
  simulationId: string
  stepId: string
  content: any
  aiFeedback: any
  score: number | null
  completedAt: string
  integrityFlags: string[]
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  step: {
    title: string
    type: string
  }
}

const Submissions: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', id],
    queryFn: async () => {
      const response = await simulationApi.getSubmissions(id!)
      return response.data as Submission[]
    },
    enabled: !!id
  })

  const filteredSubmissions = submissions?.filter(submission => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const userName = submission.user ? 
        `${submission.user.firstName} ${submission.user.lastName}`.toLowerCase() : 
        'anonymous'
      const userEmail = submission.user?.email.toLowerCase() || ''
      
      if (!userName.includes(searchLower) && !userEmail.includes(searchLower)) {
        return false
      }
    }
    
    if (statusFilter === 'withScore' && submission.score === null) return false
    if (statusFilter === 'withoutScore' && submission.score !== null) return false
    
    return true
  })

  const sortedSubmissions = filteredSubmissions?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      case 'oldest':
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      case 'scoreHigh':
        return (b.score || 0) - (a.score || 0)
      case 'scoreLow':
        return (a.score || 0) - (b.score || 0)
      default:
        return 0
    }
  })

  // Fixed stats calculation
  const scoredSubmissions = submissions?.filter(s => s.score !== null) || []
  const stats = {
    total: submissions?.length || 0,
    withScore: scoredSubmissions.length,
    avgScore: scoredSubmissions.length > 0
      ? scoredSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / scoredSubmissions.length
      : 0,
    withIntegrityFlags: submissions?.filter(s => s.integrityFlags.length > 0).length || 0
  }

  const exportToCSV = () => {
    const headers = ['Candidate', 'Email', 'Step', 'Score', 'Completed At', 'Integrity Flags']
    const rows = submissions?.map(sub => [
      sub.user ? `${sub.user.firstName} ${sub.user.lastName}` : 'Anonymous',
      sub.user?.email || 'N/A',
      sub.step.title,
      sub.score?.toFixed(1) || 'Pending',
      formatDate(sub.completedAt),
      sub.integrityFlags.join(', ') || 'None'
    ]) || []
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'submissions.csv'
    a.click()
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-800'
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Candidate Submissions</h1>
              <p className="text-muted-foreground">
                Review and evaluate candidate performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Evaluated</p>
                  <p className="text-2xl font-bold">{stats.withScore}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={stats.avgScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Integrity Flags</p>
                  <p className="text-2xl font-bold">{stats.withIntegrityFlags}</p>
                </div>
                <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Search Candidates</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Submissions</SelectItem>
                    <SelectItem value="withScore">Evaluated</SelectItem>
                    <SelectItem value="withoutScore">Pending Evaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="scoreHigh">Highest Score</SelectItem>
                    <SelectItem value="scoreLow">Lowest Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Submissions</CardTitle>
            <CardDescription>
              Review individual candidate performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : sortedSubmissions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No submissions found</h3>
                <p className="mb-4 text-muted-foreground">
                  {filteredSubmissions?.length === 0 && submissions && submissions.length > 0
                    ? "No submissions match your filters."
                    : "Candidates haven't submitted their work yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Step</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Integrity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubmissions?.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {submission.user ? 
                                  `${submission.user.firstName} ${submission.user.lastName}` : 
                                  'Anonymous'
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {submission.user?.email || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.step.title}</p>
                            <Badge variant="outline" className="mt-1">
                              {submission.step.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.score !== null ? (
                            <Badge className={`${getScoreColor(submission.score)}`}>
                              {submission.score.toFixed(1)}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(submission.completedAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.integrityFlags.length > 0 ? (
                            <Badge variant="destructive">
                              {submission.integrityFlags.length} flags
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Clean
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/submissions/${submission.id}/review`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {submission.aiFeedback && (
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Submissions