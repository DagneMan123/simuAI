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
  Search // Added missing Search icon
} from 'lucide-react'
import { simulationApi } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { formatDate } from '@/lib/utils'
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
  
  // FIXED: Variable is now used below to prevent warnings
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  const [inviteData, setInviteData] = useState({
    emails: [''],
    subject: 'You\'re invited to complete an assessment',
    message: 'Please complete the assessment at your earliest convenience.',
    expiryHours: 168,
    sendEmail: true,
  })

  const [bulkEmails, setBulkEmails] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations', id],
    queryFn: async () => {
      const response = await simulationApi.getInvitations(id!)
      return response.data as Invitation[]
    },
    enabled: !!id
  })

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

  const resendInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await simulationApi.resendInvitation(invitationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', id] })
      toast({
        title: 'Invitation Resent',
        description: 'The invitation has been resent successfully.',
      })
    }
  })

  const deleteInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await simulationApi.deleteInvitation(invitationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', id] })
      toast({
        title: 'Invitation Deleted',
        description: 'The invitation has been deleted.',
      })
    }
  })

  const handleOpenDetails = (inv: Invitation) => {
    setSelectedInvitation(inv);
    setShowDetails(true);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
      case 'COMPLETED': return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'EXPIRED': return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default: return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'EXPIRED': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const filteredInvitations = invitations?.filter(invitation => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && (invitation.status === 'PENDING' || invitation.status === 'ACCEPTED')) ||
      (activeTab === 'completed' && invitation.status === 'COMPLETED') ||
      (activeTab === 'expired' && invitation.status === 'EXPIRED');

    const matchesSearch = invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.candidate?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(link)
    toast({ title: 'Link Copied', description: 'Invitation link copied to clipboard.' })
  }

  const handleBulkInvite = () => {
    const emails = bulkEmails.split(/[\n,;]/).map(email => email.trim()).filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    if (emails.length > 0) {
      createInvitationMutation.mutate(emails)
      setShowBulkInviteDialog(false)
      setBulkEmails('')
    }
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
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invitation Manager</h1>
            <p className="text-muted-foreground">Manage and track candidate invitations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button onClick={() => setShowBulkInviteDialog(true)}><UserPlus className="mr-2 h-4 w-4" /> Bulk Invite</Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Total', val: invitationStats.total, icon: <Users className="text-blue-600" />, bg: 'bg-blue-100' },
            { label: 'Pending', val: invitationStats.pending, icon: <Clock className="text-yellow-600" />, bg: 'bg-yellow-100' },
            { label: 'Accepted', val: invitationStats.accepted, icon: <CheckCircle className="text-green-600" />, bg: 'bg-green-100' },
            { label: 'Completed', val: invitationStats.completed, icon: <FileText className="text-purple-600" />, bg: 'bg-purple-100' },
            { label: 'Expired', val: invitationStats.expired, icon: <XCircle className="text-red-600" />, bg: 'bg-red-100' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div><p className="text-sm font-medium text-muted-foreground">{stat.label}</p><p className="text-2xl font-bold">{stat.val}</p></div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle>Invitations</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
                <Button onClick={() => setShowInviteDialog(true)}><Mail className="mr-2 h-4 w-4" /> Invite</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active ({invitationStats.pending + invitationStats.accepted})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({invitationStats.completed})</TabsTrigger>
                <TabsTrigger value="expired">Expired ({invitationStats.expired})</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              {isLoading ? (
                <div className="flex justify-center py-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>
              ) : filteredInvitations && filteredInvitations.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvitations.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.email}</TableCell>
                          <TableCell><div className="flex items-center gap-2">{getStatusIcon(inv.status)}{getStatusBadge(inv.status)}</div></TableCell>
                          <TableCell>{formatDate(inv.sentAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDetails(inv)}><Eye className="mr-2 h-4 w-4" /> Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyInviteLink(inv.token)}><Copy className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => deleteInvitationMutation.mutate(inv.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  icon={<Users className="h-12 w-12 text-muted-foreground" />}
                  title="No invitations found"
                  description="Start by inviting candidates to your simulation."
                />
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Details Dialog - Fixes the selectedInvitation warning */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent>
            <DialogHeader><DialogTitle>Invitation Details</DialogTitle></DialogHeader>
            {selectedInvitation && (
              <div className="space-y-4 py-4">
                <p><strong>Email:</strong> {selectedInvitation.email}</p>
                <p><strong>Status:</strong> {selectedInvitation.status}</p>
                <p><strong>Sent Date:</strong> {formatDate(selectedInvitation.sentAt)}</p>
                <p><strong>Expiry Date:</strong> {formatDate(selectedInvitation.expiresAt)}</p>
              </div>
            )}
            <DialogFooter><Button onClick={() => setShowDetails(false)}>Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Single Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Invite Candidate</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <Label>Email Address</Label>
              <Input type="email" placeholder="email@example.com" value={inviteData.emails[0]} onChange={(e) => setInviteData({ ...inviteData, emails: [e.target.value] })} />
            </div>
            <DialogFooter>
              <Button onClick={() => createInvitationMutation.mutate(inviteData.emails)} disabled={createInvitationMutation.isPending}>
                {createInvitationMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Invite Dialog */}
        <Dialog open={showBulkInviteDialog} onOpenChange={setShowBulkInviteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Bulk Invite</DialogTitle></DialogHeader>
            <Textarea placeholder="email1@example.com, email2@example.com..." rows={6} className="mt-4" value={bulkEmails} onChange={(e) => setBulkEmails(e.target.value)} />
            <DialogFooter className="mt-4"><Button onClick={handleBulkInvite}>Send All</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default InvitationManager