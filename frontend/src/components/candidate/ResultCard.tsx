import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Target,
  Download,
  Share2,
  RefreshCw,
  Eye,
  FileText,
  Calendar,
  Star,
  Trophy,
  Medal,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  
} from 'recharts';

interface TestResult {
  id: string;
  testName: string;
  company: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string;
  rank: number;
  totalParticipants: number;
  status: 'passed' | 'failed' | 'pending';
  skills: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
  feedback?: string;
  certificateUrl?: string;
  detailedReportUrl?: string;
}

interface ResultCardProps {
  result: TestResult;
  showDetails?: boolean;
  onRetake?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  
  onRetake,
  onDownload,
  onShare
}) => {
  const {
    testName,
    company,
    date,
    score,
    totalQuestions,
    correctAnswers,
    timeTaken,
    rank,
    totalParticipants,
    status,
    skills,
    feedback,
    certificateUrl,
    detailedReportUrl
  } = result;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    if (score >= 60) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'passed':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank <= 3) return <Medal className="h-5 w-5 text-yellow-400" />;
    if (rank <= 10) return <Trophy className="h-5 w-5 text-yellow-300" />;
    return <Star className="h-5 w-5 text-gray-400" />;
  };

  const radarData = skills.map(skill => ({
    subject: skill.name,
    score: (skill.score / skill.maxScore) * 100,
    fullMark: 100
  }));

  const barData = skills.map(skill => ({
    name: skill.name,
    score: skill.score,
    maxScore: skill.maxScore,
    percentage: (skill.score / skill.maxScore) * 100
  }));

  const percentage = (correctAnswers / totalQuestions) * 100;
  const percentile = ((totalParticipants - rank) / totalParticipants) * 100;

  return (
    <Card className="overflow-hidden border shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">{testName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <span>{company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {date}
              </span>
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 border rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(score)} mb-2`}>
              {score}%
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
            <Progress value={score} className="h-2 mt-2" />
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Correct Answers</div>
            <div className="text-xs text-gray-500 mt-1">
              {percentage.toFixed(1)}% accuracy
            </div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {timeTaken}
            </div>
            <div className="text-sm text-gray-600">Time Taken</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: 45 mins • Saved: 15 mins
            </div>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getRankIcon()}
              <div className="text-3xl font-bold text-gray-800">#{rank}</div>
            </div>
            <div className="text-sm text-gray-600">Rank</div>
            <div className="text-xs text-gray-500 mt-1">
              Top {percentile.toFixed(1)}% of {totalParticipants}
            </div>
          </div>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="details">Detailed Report</TabsTrigger>
          </TabsList>
          
          {/* Skills Analysis Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Radar</CardTitle>
                  <CardDescription>Performance across different skill areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Your Score"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Breakdown</CardTitle>
                  <CardDescription>Detailed performance by skill</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills.map((skill, idx) => {
                      const percentage = (skill.score / skill.maxScore) * 100;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className={getScoreColor(percentage)}>
                              {skill.score}/{skill.maxScore} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Comparison</CardTitle>
                <CardDescription>How you compare to other candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="percentage" 
                        name="Your Score (%)" 
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey={() => 75} 
                        name="Average Score (%)" 
                        fill="#9ca3af"
                        radius={[4, 4, 0, 0]}
                        opacity={0.5}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">#{rank}</div>
                    <div className="text-sm text-gray-600">Your Rank</div>
                    <div className="mt-4 flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ value: percentile }]} layout="vertical">
                              <Bar dataKey="value" fill="#3b82f6" radius={4} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{percentile.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Percentile Rank</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { score: 40, count: 5 },
                          { score: 50, count: 12 },
                          { score: 60, count: 25 },
                          { score: 70, count: 40 },
                          { score: 80, count: 35 },
                          { score: 90, count: 15 },
                          { score: 100, count: 3 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="score" label={{ value: 'Score', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Candidates', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Your score of {score}% is higher than {percentile.toFixed(1)}% of participants
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills
                    .filter(skill => (skill.score / skill.maxScore) * 100 < 70)
                    .map((skill, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-red-500" />
                            <span className="font-medium">{skill.name}</span>
                          </div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Needs Improvement
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          Score: {skill.score}/{skill.maxScore} ({(skill.score / skill.maxScore * 100).toFixed(0)}%)
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Recommendation:</span>{' '}
                          {skill.name === 'JavaScript' 
                            ? 'Practice advanced concepts like closures, promises, and async/await.'
                            : skill.name === 'React'
                            ? 'Focus on hooks, state management, and performance optimization.'
                            : 'Review fundamentals and practice more exercises.'}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Detailed Report Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Test Duration</p>
                      <p className="font-medium">60 minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Question Types</p>
                      <p className="font-medium">Multiple Choice, Coding, Text Response</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Difficulty Level</p>
                      <p className="font-medium">Intermediate to Advanced</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passing Score</p>
                      <p className="font-medium">70%</p>
                    </div>
                  </div>
                  
                  {feedback && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">AI Feedback</p>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-gray-700">{feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {certificateUrl && (
                <Button onClick={onDownload} className="bg-gradient-to-r from-green-600 to-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              )}
              
              {detailedReportUrl && (
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Report
                </Button>
              )}
              
              <Button variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              
              {onRetake && (
                <Button variant="outline" onClick={onRetake}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
              )}
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Solutions
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Footer */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Ready for the next challenge?</p>
                <p className="text-sm text-gray-500">Take another test to improve your skills</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View Similar Tests</Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                See Recommendations
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Certificate Badge */}
      {status === 'passed' && certificateUrl && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white gap-1">
            <Trophy className="h-3 w-3" />
            Certificate Available
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default ResultCard;