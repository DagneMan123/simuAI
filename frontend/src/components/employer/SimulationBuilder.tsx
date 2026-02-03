import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Clock, 
  Hash, 
  DollarSign,
  Eye,
  Code,
  MessageSquare,
  FileText,
  Video,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface Question {
  id: string;
  type: 'text' | 'code' | 'video' | 'multiple-choice';
  question: string;
  answer?: string;
  options?: string[];
  correctAnswer?: string;
  timeLimit: number;
  points: number;
}

interface SimulationTemplate {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface NewQuestionState {
  type: 'text' | 'code' | 'video' | 'multiple-choice';
  question: string;  // አሁን ሁልጊዜ string ነው
  timeLimit: number;
  points: number;
}

const SimulationBuilder: React.FC = () => {
  const [simulation, setSimulation] = useState({
    title: '',
    description: '',
    role: '',
    department: '',
    difficulty: 'intermediate',
    timeLimit: 60,
    totalPoints: 100,
    enableAiProctoring: true,
    allowRetake: false,
    showResults: true,
    tags: [] as string[],
    questions: [] as Question[],
  });

  const [newQuestion, setNewQuestion] = useState<NewQuestionState>({
    type: 'text',
    question: '',  // ሁልጊዜ string እንዲሆን ማረጋገጫ
    timeLimit: 5,
    points: 10,
  });

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('questions');

  const questionTypes = [
    { value: 'text', label: 'Text Response', icon: <Type size={16} />, color: 'bg-blue-100 text-blue-700' },
    { value: 'code', label: 'Coding Challenge', icon: <Code size={16} />, color: 'bg-green-100 text-green-700' },
    { value: 'video', label: 'Video Response', icon: <Video size={16} />, color: 'bg-purple-100 text-purple-700' },
    { value: 'multiple-choice', label: 'Multiple Choice', icon: <FileText size={16} />, color: 'bg-orange-100 text-orange-700' },
  ];

  const templates: SimulationTemplate[] = [
    {
      id: '1',
      name: 'Frontend Developer',
      description: 'React, JavaScript, HTML/CSS assessment',
      questions: Array(5).fill({} as Question),
    },
    {
      id: '2',
      name: 'Backend Engineer',
      description: 'Node.js, API Design, Database',
      questions: Array(6).fill({} as Question),
    },
    {
      id: '3',
      name: 'Full Stack',
      description: 'Complete web development assessment',
      questions: Array(8).fill({} as Question),
    },
  ];

  const addQuestion = () => {
    if (!newQuestion.question.trim()) return;  // አሁን ስህተት የለም

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type,
      question: newQuestion.question,
      timeLimit: newQuestion.timeLimit || 5,
      points: newQuestion.points || 10,
      options: newQuestion.type === 'multiple-choice' ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : undefined,
      correctAnswer: newQuestion.type === 'multiple-choice' ? 'Option 1' : undefined,
    };

    setSimulation(prev => ({
      ...prev,
      questions: [...prev.questions, question],
    }));

    setNewQuestion({
      type: 'text',
      question: '',
      timeLimit: 5,
      points: 10,
    });
  };

  const removeQuestion = (id: string) => {
    setSimulation(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  };

  const duplicateQuestion = (question: Question) => {
    const duplicated: Question = {
      ...question,
      id: Date.now().toString(),
    };
    setSimulation(prev => ({
      ...prev,
      questions: [...prev.questions, duplicated],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSimulation(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !simulation.tags.includes(tagInput.trim())) {
      setSimulation(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSimulation(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const loadTemplate = (template: SimulationTemplate) => {
    setSimulation(prev => ({
      ...prev,
      questions: template.questions,
      title: template.name,
      description: template.description,
    }));
  };

  const calculateTotalPoints = () => {
    return simulation.questions.reduce((sum, q) => sum + q.points, 0);
  };

  const calculateTotalTime = () => {
    return simulation.questions.reduce((sum, q) => sum + q.timeLimit, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create New Simulation</h2>
          <p className="text-gray-600">Design an AI-powered assessment for candidates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Simulation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="templates" className="hidden lg:flex">
            <Copy className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Details</CardTitle>
              <CardDescription>
                Define the basic information about your assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Simulation Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Frontend Developer Assessment"
                    value={simulation.title}
                    onChange={(e) => setSimulation(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Role *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Frontend Developer"
                    value={simulation.role}
                    onChange={(e) => setSimulation(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this simulation assesses..."
                  rows={4}
                  value={simulation.description}
                  onChange={(e) => setSimulation(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={simulation.department}
                    onValueChange={(value) => setSimulation(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={simulation.difficulty}
                    onValueChange={(value) => setSimulation(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Total Time Limit (minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="timeLimit"
                      type="number"
                      className="pl-10"
                      value={simulation.timeLimit}
                      onChange={(e) => setSimulation(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (React, JavaScript, etc.)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {simulation.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add Question Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
                <CardDescription>Create a new question for the simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        className={`
                          p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors
                          ${newQuestion.type === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => setNewQuestion(prev => ({ ...prev, type: type.value as NewQuestionState['type'] }))}
                      >
                        <div className={`p-2 rounded-full ${type.color}`}>
                          {type.icon}
                        </div>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-text">Question Text *</Label>
                  <Textarea
                    id="question-text"
                    placeholder="Enter your question here..."
                    rows={3}
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time-limit">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Limit (min)
                      </div>
                    </Label>
                    <Input
                      id="time-limit"
                      type="number"
                      min="1"
                      max="60"
                      value={newQuestion.timeLimit}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 5 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Points
                      </div>
                    </Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      max="100"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                    />
                  </div>
                </div>

                <Button onClick={addQuestion} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Right: Questions List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Questions ({simulation.questions.length})</CardTitle>
                    <CardDescription>
                      Total: {calculateTotalPoints()} points • {calculateTotalTime()} minutes
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {simulation.questions.length} / 20 questions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {simulation.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No questions yet</h3>
                    <p className="text-gray-500 mt-1">Add your first question to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {simulation.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={questionTypes.find(t => t.value === question.type)?.color}>
                              {questionTypes.find(t => t.value === question.type)?.icon}
                              <span className="ml-2">
                                {questionTypes.find(t => t.value === question.type)?.label}
                              </span>
                            </Badge>
                            <span className="text-sm text-gray-500">Q{index + 1}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateQuestion(question)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-medium mb-3">{question.question}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {question.timeLimit} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {question.points} points
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuestion(question.id, { points: question.points + 5 })}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
              <CardDescription>Configure assessment rules and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">AI Proctoring</Label>
                      <p className="text-sm text-gray-500">Monitor candidate behavior during assessment</p>
                    </div>
                    <Switch
                      checked={simulation.enableAiProctoring}
                      onCheckedChange={(checked) => 
                        setSimulation(prev => ({ ...prev, enableAiProctoring: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Retake</Label>
                      <p className="text-sm text-gray-500">Candidates can retake the simulation</p>
                    </div>
                    <Switch
                      checked={simulation.allowRetake}
                      onCheckedChange={(checked) => 
                        setSimulation(prev => ({ ...prev, allowRetake: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Results</Label>
                      <p className="text-sm text-gray-500">Display scores to candidates after completion</p>
                    </div>
                    <Switch
                      checked={simulation.showResults}
                      onCheckedChange={(checked) => 
                        setSimulation(prev => ({ ...prev, showResults: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Passing Score (%)</Label>
                    <Input type="number" min="0" max="100" defaultValue="70" />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Attempts</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select max attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt</SelectItem>
                        <SelectItem value="2">2 attempts</SelectItem>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Result Validity (days)</Label>
                    <Input type="number" min="1" max="365" defaultValue="30" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Randomize Questions</Label>
                    <Select defaultValue="no">
                      <SelectTrigger>
                        <SelectValue placeholder="Randomize order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No randomization</SelectItem>
                        <SelectItem value="yes">Randomize all questions</SelectItem>
                        <SelectItem value="partial">Randomize within sections</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Strategy</Label>
                    <Select defaultValue="per-question">
                      <SelectTrigger>
                        <SelectValue placeholder="Time management" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per-question">Per question timing</SelectItem>
                        <SelectItem value="total-time">Total time only</SelectItem>
                        <SelectItem value="flexible">Flexible timing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Templates</CardTitle>
              <CardDescription>Start with a pre-built template or create from scratch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => loadTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline">{template.questions.length} questions</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Popular</span>
                      <Button variant="ghost" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Create New Template */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Custom Template</h3>
                      <p className="text-gray-600 text-sm text-center mb-4">
                        Create a custom template from scratch
                      </p>
                      <Button variant="outline">Create New</Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save as Template</DialogTitle>
                      <DialogDescription>
                        Save your current simulation as a reusable template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input id="template-name" placeholder="Enter template name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-description">Description</Label>
                        <Textarea id="template-description" placeholder="Describe this template" />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Save Template</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-2xl font-bold">{simulation.questions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Points</p>
              <p className="text-2xl font-bold">{calculateTotalPoints()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="text-2xl font-bold">{calculateTotalTime()} min</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Estimated Cost</p>
              <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {(simulation.questions.length * 5).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Publish Simulation
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Simulation Preview</DialogTitle>
            <DialogDescription>
              This is how candidates will see your assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Simulation Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{simulation.title || 'Untitled Simulation'}</h2>
              <p className="text-gray-600 mb-4">{simulation.description || 'No description provided'}</p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="gap-2">
                  <Clock className="h-3 w-3" />
                  {simulation.timeLimit} minutes
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Hash className="h-3 w-3" />
                  {calculateTotalPoints()} points
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <FileText className="h-3 w-3" />
                  {simulation.questions.length} questions
                </Badge>
              </div>
            </div>

            {/* Instructions */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <span>Read each question carefully before answering</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <span>Time limit per question will be shown</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <span>AI proctoring is enabled - maintain test integrity</span>
                </li>
              </ul>
            </div>

            {/* Questions Preview */}
            {simulation.questions.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Questions Preview</h3>
                {simulation.questions.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Q{index + 1}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {questionTypes.find(t => t.value === question.type)?.icon}
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </Badge>
                      <span className="text-sm text-gray-500 ml-auto">
                        {question.points} points • {question.timeLimit} min
                      </span>
                    </div>
                    <p className="font-medium">{question.question}</p>
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="mt-4 space-y-2">
                        {question.options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
                            <div className="w-4 h-4 border rounded-full border-gray-300" />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {simulation.questions.length > 3 && (
                  <p className="text-center text-gray-500">
                    ...and {simulation.questions.length - 3} more questions
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No questions added yet</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button onClick={() => setActiveTab('questions')}>Add Questions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimulationBuilder;