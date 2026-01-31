import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  UserPlus,
  Mail,
  Copy,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  Users,
  Calendar,
  FileText,
  Share2
} from 'lucide-react'
import { simulationApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import EmptyState from '@/components/EmptyState'

interface Invitation {
  id: string
  email: string
  candidateId?: string
  candidate?: {
    firstName: string
    lastName: string
  }
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'EXPIRED'
  sentAt: string
  expiresAt: string
  token: string
  simulation: {
    title: string
    duration: number
  }
}

const InvitationManager: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('active')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showBulkInviteDialog, setShowBulkInviteDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  
  const [inviteData, setInviteData] = useState({
    emails: [''],
    subject: 'You\'re invited to complete an assessment',
    message: 'Please complete the assessment at your earliest convenience.',
    expiryHours: 168, // 7 days
    sendEmail: true,
  })

  const [bulkEmails, setBulkEmails] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch invitations
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations', id],
    queryFn: async () => {
      const response = await simulationApi.getInvitations(id!)
      return response.data as Invitation[]
    },
    enabled: !!id
  })

  // Create invitation mutation
  const createInvitationMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      return simulationApi.inviteCandidates(id!, emails)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', id] })
      setShowInviteDialog(false)
      setInviteData({
        emails: [''],
        subject: 'You\'re invited to complete an assessment',
        message: 'Please complete the assessment at your earliest convenience.',
        expiryHours: 168,
        sendEmail: true,
      })
      toast({
        title: 'Invitations Sent',
        description: 'Candidates have been invited successfully.',
        variant: 'default',
      })
    },
    onError: () => {
      toast({
        title: 'Failed to Send',
        description: 'There was an error sending invitations.',
        variant: 'destructive',
      })
    }
  })

  // Resend invitation
  const resendInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await simulationApi.resendInvitation(invitationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', id] })
      toast({
        title: 'Invitation Resent',
        description: 'The invitation has been resent successfully.',
        variant: 'default',
      })
    }
  })

  // Delete invitation
  const deleteInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await simulationApi.deleteInvitation(invitationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', id] })
      toast({
        title: 'Invitation Deleted',
        description: 'The invitation has been deleted.',
        variant: 'default',
      })
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'EXPIRED':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const filteredInvitations = invitations?.filter(invitation => {
    if (activeTab === 'active') {
      return invitation.status === 'PENDING' || invitation.status === 'ACCEPTED'
    } else if (activeTab === 'completed') {
      return invitation.status === 'COMPLETED'
    } else if (activeTab === 'expired') {
      return invitation.status === 'EXPIRED'
    }
    return true
  }).filter(invitation => 
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.candidate?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.candidate?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link Copied',
      description: 'Invitation link copied to clipboard.',
      variant: 'default',
    })
  }

  const handleBulkInvite = () => {
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && validateEmail(email))
    
    if (emails.length === 0) {
      toast({
        title: 'No valid emails',
        description: 'Please enter valid email addresses.',
        variant: 'destructive',
      })
      return
    }

    createInvitationMutation.mutate(emails)
    setShowBulkInviteDialog(false)
    setBulkEmails('')
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const exportInvitations = () => {
    const csvContent = [
      ['Email', 'Status', 'Sent At', 'Expires At', 'Candidate'],
      ...(invitations || []).map(inv => [
        inv.email,
        inv.status,
        formatDate(inv.sentAt),
        formatDate(inv.expiresAt),
        inv.candidate ? `${inv.candidate.firstName} ${inv.candidate.lastName}` : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invitations-${new Date().toISOString()}.csv`
    a.click()
  }

  const invitationStats = {
    total: invitations?.length || 0,
    pending: invitations?.filter(i => i.status === 'PENDING').length || 0,
    accepted: invitations?.filter(i => i.status === 'ACCEPTED').length || 0,
    completed: invitations?.filter(i => i.status === 'COMPLETED').length || 0,
    expired: invitations?.filter(i => i.status === 'EXPIRED').length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invitation Manager</h1>
              <p className="text-muted-foreground">
                Manage and track candidate invitations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportInvitations}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setShowBulkInviteDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Bulk Invite
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Invited</p>
                  <p className="text-2xl font-bold">{invitationStats.total}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{invitationStats.pending}</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">{invitationStats.accepted}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{invitationStats.completed}</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold">{invitationStats.expired}</p>
                </div>
                <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Invitations</CardTitle>
                <CardDescription>
                  Manage all candidate invitations for this simulation
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Invite Candidate
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  Active
                  <Badge variant="secondary">{invitationStats.pending + invitationStats.accepted}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  Completed
                  <Badge variant="secondary">{invitationStats.completed}</Badge>
                </TabsTrigger>
                <TabsTrigger value="expired" className="flex items-center gap-2">
                  Expired
                  <Badge variant="secondary">{invitationStats.expired}</Badge>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All
                  <Badge variant="secondary">{invitationStats.total}</Badge>
                </TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredInvitations && filteredInvitations.length > 0 ? (
                <>
                  <TabsContent value={activeTab} className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>
                                {invitation.candidate ? (
                                  <div>
                                    <p className="font-medium">
                                      {invitation.candidate.firstName} {invitation.candidate.lastName}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not registered</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {invitation.email}
                                  {invitation.status === 'PENDING' && (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" title="Invitation pending" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invitation.status)}
                                  {getStatusBadge(invitation.status)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {formatDate(invitation.sentAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {formatDate(invitation.expiresAt)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {invitation.status === 'PENDING' && (
                                      <DropdownMenuItem
                                        onClick={() => resendInvitationMutation.mutate(invitation.id)}
                                      >
                                        <Send className="mr-2 h-4 w-4" />
                                        Resend Invitation
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => copyInviteLink(invitation.token)}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Invite Link
                                    </DropdownMenuItem>
                                    {invitation.status === 'COMPLETED' && invitation.candidate && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // Navigate to candidate results
                                          toast({
                                            title: 'Viewing results',
                                            description: 'Redirecting to candidate results...',
                                          })
                                        }}
                                      >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Results
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => deleteInvitationMutation.mutate(invitation.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  {/* Duplicate TabsContent for other tabs */}
                  <TabsContent value="completed" className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        {/* Same table structure as above */}
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead>Completed</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>
                                {invitation.candidate ? (
                                  <div>
                                    <p className="font-medium">
                                      {invitation.candidate.firstName} {invitation.candidate.lastName}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not registered</span>
                                )}
                              </TableCell>
                              <TableCell>{invitation.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invitation.status)}
                                  {getStatusBadge(invitation.status)}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(invitation.sentAt)}</TableCell>
                              <TableCell>
                                {invitation.status === 'COMPLETED' ? formatDate(invitation.expiresAt) : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => copyInviteLink(invitation.token)}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Link
                                    </DropdownMenuItem>
                                    {invitation.candidate && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // Navigate to candidate results
                                          toast({
                                            title: 'Viewing results',
                                            description: 'Redirecting to candidate results...',
                                          })
                                        }}
                                      >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Results
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => deleteInvitationMutation.mutate(invitation.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="expired" className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead>Expired</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>
                                {invitation.candidate ? (
                                  <div>
                                    <p className="font-medium">
                                      {invitation.candidate.firstName} {invitation.candidate.lastName}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not registered</span>
                                )}
                              </TableCell>
                              <TableCell>{invitation.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invitation.status)}
                                  {getStatusBadge(invitation.status)}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(invitation.sentAt)}</TableCell>
                              <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => resendInvitationMutation.mutate(invitation.id)}
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      Resend Invitation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => deleteInvitationMutation.mutate(invitation.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="all" className="mt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell>
                                {invitation.candidate ? (
                                  <div>
                                    <p className="font-medium">
                                      {invitation.candidate.firstName} {invitation.candidate.lastName}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not registered</span>
                                )}
                              </TableCell>
                              <TableCell>{invitation.email}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invitation.status)}
                                  {getStatusBadge(invitation.status)}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(invitation.sentAt)}</TableCell>
                              <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {invitation.status === 'PENDING' && (
                                      <DropdownMenuItem
                                        onClick={() => resendInvitationMutation.mutate(invitation.id)}
                                      >
                                        <Send className="mr-2 h-4 w-4" />
                                        Resend Invitation
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => copyInviteLink(invitation.token)}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Invite Link
                                    </DropdownMenuItem>
                                    {invitation.status === 'COMPLETED' && invitation.candidate && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // Navigate to candidate results
                                          toast({
                                            title: 'Viewing results',
                                            description: 'Redirecting to candidate results...',
                                          })
                                        }}
                                      >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Results
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => deleteInvitationMutation.mutate(invitation.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </>
              ) : (
                <EmptyState
                  icon={<Users className="h-12 w-12 text-muted-foreground" />}
                  title="No invitations found"
                  description={
                    activeTab === 'active'
                      ? 'No active invitations. Invite candidates to get started.'
                      : `No ${activeTab} invitations found.`
                  }
                  action={
                    activeTab === 'active' ? (
                      <Button onClick={() => setShowInviteDialog(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Invite Candidates
                      </Button>
                    ) : null
                  }
                />
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Single Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite Candidate</DialogTitle>
              <DialogDescription>
                Send an invitation to a candidate to complete the simulation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="candidate@example.com"
                  value={inviteData.emails[0]}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, emails: [e.target.value] })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={inviteData.subject}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, subject: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={inviteData.message}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, message: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Invitation Expiry</Label>
                <Select
                  value={inviteData.expiryHours.toString()}
                  onValueChange={(value) =>
                    setInviteData({ ...inviteData, expiryHours: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="72">3 days</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                    <SelectItem value="336">14 days</SelectItem>
                    <SelectItem value="720">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={inviteData.sendEmail}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, sendEmail: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="sendEmail">Send email notification</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createInvitationMutation.mutate(inviteData.emails)}
                disabled={createInvitationMutation.isPending || !inviteData.emails[0]}
              >
                {createInvitationMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Invite Dialog */}
        <Dialog open={showBulkInviteDialog} onOpenChange={setShowBulkInviteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Bulk Invite Candidates</DialogTitle>
              <DialogDescription>
                Invite multiple candidates at once. Enter emails separated by commas, semicolons, or new lines.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bulkEmails">Email Addresses *</Label>
                <Textarea
                  id="bulkEmails"
                  placeholder="candidate1@example.com&#10;candidate2@example.com&#10;candidate3@example.com"
                  rows={6}
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter one or more email addresses separated by commas, semicolons, or new lines.
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-300">Note:</p>
                    <p className="text-blue-700 dark:text-blue-400">
                      Each candidate will receive a unique invitation link. You can customize the invitation message
                      in the single invite dialog.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkInvite} disabled={!bulkEmails.trim()}>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invitations
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Save Template Dialog */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
              <DialogDescription>
                Save this invitation as a template for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Standard Assessment Invitation"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Preview</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Subject: {inviteData.subject}
                </p>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  Message: {inviteData.message.substring(0, 50)}...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Expiry: {inviteData.expiryHours} hours
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Save template logic here
                  toast({
                    title: 'Template Saved',
                    description: 'Your invitation template has been saved.',
                  })
                  setShowTemplateDialog(false)
                  setTemplateName('')
                }}
                disabled={!templateName.trim()}
              >
                <FileText className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default InvitationManager