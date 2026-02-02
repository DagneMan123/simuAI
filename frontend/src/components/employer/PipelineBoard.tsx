import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  MoreVertical, 
  UserCheck, 
  Clock,
  MessageSquare,
  FileText,
  Award,
  Filter,
  Search,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  score: number;
  stage: 'new' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';
  position: string;
  appliedDate: string;
  lastActivity: string;
  tags: string[];
  experience: string;
  notes?: string;
  resumeUrl?: string;
}

interface PipelineStage {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  color: string;
  icon: React.ReactNode;
}

const PipelineBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterScore, setFilterScore] = useState<string>('all');

  const initialCandidates: Candidate[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, NY',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      score: 85,
      stage: 'new',
      position: 'Senior Frontend Developer',
      appliedDate: '2024-02-01',
      lastActivity: '2 hours ago',
      tags: ['React', 'TypeScript', 'Next.js'],
      experience: '5 years',
      notes: 'Strong React skills, needs improvement in testing',
      resumeUrl: '#'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      location: 'San Francisco, CA',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      score: 92,
      stage: 'screening',
      position: 'Full Stack Developer',
      appliedDate: '2024-01-28',
      lastActivity: '1 day ago',
      tags: ['React', 'Node.js', 'MongoDB'],
      experience: '7 years',
      resumeUrl: '#'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      location: 'Austin, TX',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      score: 78,
      stage: 'interview',
      position: 'Frontend Developer',
      appliedDate: '2024-01-25',
      lastActivity: '3 days ago',
      tags: ['JavaScript', 'Vue.js', 'CSS'],
      experience: '3 years',
      resumeUrl: '#'
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+1234567893',
      location: 'Boston, MA',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
      score: 95,
      stage: 'assessment',
      position: 'React Developer',
      appliedDate: '2024-01-30',
      lastActivity: '5 hours ago',
      tags: ['React', 'Redux', 'Jest'],
      experience: '4 years',
      resumeUrl: '#'
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      phone: '+1234567894',
      location: 'Seattle, WA',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
      score: 88,
      stage: 'offer',
      position: 'Senior React Developer',
      appliedDate: '2024-01-20',
      lastActivity: '1 week ago',
      tags: ['React', 'TypeScript', 'GraphQL'],
      experience: '6 years',
      resumeUrl: '#'
    },
    {
      id: '6',
      name: 'David Lee',
      email: 'david@example.com',
      phone: '+1234567895',
      location: 'Chicago, IL',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      score: 90,
      stage: 'hired',
      position: 'Lead Frontend Developer',
      appliedDate: '2024-01-15',
      lastActivity: '2 weeks ago',
      tags: ['React', 'Leadership', 'Architecture'],
      experience: '8 years',
      resumeUrl: '#'
    },
    {
      id: '7',
      name: 'Emma Garcia',
      email: 'emma@example.com',
      phone: '+1234567896',
      location: 'Miami, FL',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      score: 72,
      stage: 'rejected',
      position: 'Junior Developer',
      appliedDate: '2024-01-22',
      lastActivity: '4 days ago',
      tags: ['HTML', 'CSS', 'JavaScript'],
      experience: '1 year',
      resumeUrl: '#'
    },
  ];

  const stages: PipelineStage[] = [
    {
      id: 'new',
      title: 'New',
      description: 'New applicants',
      candidates: initialCandidates.filter(c => c.stage === 'new'),
      color: 'bg-blue-100 border-blue-200',
      icon: <Users className="h-4 w-4 text-blue-600" />
    },
    {
      id: 'screening',
      title: 'Screening',
      description: 'Initial review',
      candidates: initialCandidates.filter(c => c.stage === 'screening'),
      color: 'bg-yellow-100 border-yellow-200',
      icon: <Eye className="h-4 w-4 text-yellow-600" />
    },
    {
      id: 'interview',
      title: 'Interview',
      description: 'Interview scheduled',
      candidates: initialCandidates.filter(c => c.stage === 'interview'),
      color: 'bg-purple-100 border-purple-200',
      icon: <MessageSquare className="h-4 w-4 text-purple-600" />
    },
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Technical tests',
      candidates: initialCandidates.filter(c => c.stage === 'assessment'),
      color: 'bg-green-100 border-green-200',
      icon: <FileText className="h-4 w-4 text-green-600" />
    },
    {
      id: 'offer',
      title: 'Offer',
      description: 'Offer extended',
      candidates: initialCandidates.filter(c => c.stage === 'offer'),
      color: 'bg-orange-100 border-orange-200',
      icon: <Award className="h-4 w-4 text-orange-600" />
    },
    {
      id: 'hired',
      title: 'Hired',
      description: 'Successfully hired',
      candidates: initialCandidates.filter(c => c.stage === 'hired'),
      color: 'bg-emerald-100 border-emerald-200',
      icon: <UserCheck className="h-4 w-4 text-emerald-600" />
    },
    {
      id: 'rejected',
      title: 'Rejected',
      description: 'Not selected',
      candidates: initialCandidates.filter(c => c.stage === 'rejected'),
      color: 'bg-red-100 border-red-200',
      icon: <Clock className="h-4 w-4 text-red-600" />
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredStages = filterStage === 'all' 
    ? stages 
    : stages.filter(stage => stage.id === filterStage);

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('candidateId', candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    console.log(`Moving candidate ${candidateId} to stage ${stageId}`);
    // Implement actual move logic here
  };

  const getCandidateStats = () => {
    const total = initialCandidates.length;
    const hired = initialCandidates.filter(c => c.stage === 'hired').length;
    const inProgress = initialCandidates.filter(c => 
      ['new', 'screening', 'interview', 'assessment', 'offer'].includes(c.stage)
    ).length;
    const rejected = initialCandidates.filter(c => c.stage === 'rejected').length;
    
    const avgScore = initialCandidates.reduce((sum, c) => sum + c.score, 0) / total;
    
    return { total, hired, inProgress, rejected, avgScore: avgScore.toFixed(1) };
  };

  const stats = getCandidateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Candidate Pipeline</h2>
          <p className="text-gray-600">Track candidates through your hiring process</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Candidates</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">{stats.inProgress}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hired</p>
                <h3 className="text-2xl font-bold mt-1">{stats.hired}</h3>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold mt-1">{stats.rejected}</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Score</p>
                <h3 className="text-2xl font-bold mt-1">{stats.avgScore}%</h3>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search candidates by name, email, or skills..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>
                  <div className="flex items-center gap-2">
                    {stage.icon}
                    {stage.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterScore} onValueChange={setFilterScore}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90+">90+ (Excellent)</SelectItem>
              <SelectItem value="80-89">80-89 (Good)</SelectItem>
              <SelectItem value="70-79">70-79 (Average)</SelectItem>
              <SelectItem value="below-70">Below 70 (Poor)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {filteredStages.map((stage) => (
            <div
              key={stage.id}
              className={`w-80 flex-shrink-0 border rounded-lg ${stage.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${stage.color.replace('bg-', 'bg-').replace(' border-', '')}`}>
                      {stage.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{stage.title}</h3>
                      <p className="text-sm text-gray-500">{stage.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {stage.candidates.length}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {stage.candidates.length} candidate(s)
                </div>
              </div>

              {/* Candidates List */}
              <div className="p-2 space-y-3 max-h-[500px] overflow-y-auto">
                {stage.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-800">{candidate.name}</h4>
                          <p className="text-sm text-gray-500">{candidate.position}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Clock className="mr-2 h-4 w-4" />
                            Reject Candidate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Score & Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getScoreColor(candidate.score)}>
                          <Star className="h-3 w-3 mr-1" />
                          {candidate.score}% Score
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {candidate.experience} exp
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        {candidate.location && (
                          <div className="flex items-center gap-1 text-gray-600 col-span-2">
                            <MapPin className="h-3 w-3" />
                            <span>{candidate.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {candidate.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <ChevronRight className="mr-1 h-3 w-3" />
                          Move
                        </Button>
                      </div>

                      {/* Timeline */}
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <div className="flex justify-between">
                          <span>Applied: {candidate.appliedDate}</span>
                          <span>Last: {candidate.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {stage.candidates.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No candidates in this stage</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Add Candidate
                    </Button>
                  </div>
                )}
              </div>

              {/* Add Candidate Button */}
              <div className="p-3 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add Candidate to {stage.title}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Analytics */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Pipeline Analytics</h3>
              <p className="text-gray-600">Track your hiring funnel performance</p>
            </div>
            <Select defaultValue="30-days">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7-days">Last 7 days</SelectItem>
                <SelectItem value="30-days">Last 30 days</SelectItem>
                <SelectItem value="90-days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {stages.map((stage) => {
              const count = stage.candidates.length;
              const percentage = (count / stats.total) * 100;
              
              return (
                <div key={stage.id} className="text-center">
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${stage.color.split(' ')[0]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    {stage.icon}
                    <span className="font-medium">{stage.title}</span>
                  </div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>

          {/* Conversion Rates */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-semibold mb-4">Stage Conversion Rates</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New → Screening</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '85%' }} />
                  </div>
                  <span className="font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Screening → Interview</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '60%' }} />
                  </div>
                  <span className="font-medium">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interview → Offer</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '40%' }} />
                  </div>
                  <span className="font-medium">40%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Hire Rate</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '20%' }} />
                  </div>
                  <span className="font-medium text-emerald-600">20%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineBoard;