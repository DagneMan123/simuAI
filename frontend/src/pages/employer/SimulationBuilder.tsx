import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, Save, Eye, Copy, Clock, Settings, AlertTriangle } from 'lucide-react'
import { simulationApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'

interface SimulationStep {
  id: string
  type: 'AI_CHAT' | 'CODE_REVIEW' | 'DOCUMENT_ANALYSIS' | 'MULTIPLE_CHOICE'
  title: string
  instructions: string
  content: any
  aiPersona?: string
  expectedOutput?: any
}

interface RubricCriteria {
  id: string
  name: string
  description: string
  weight: number
}

const SimulationBuilder: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')
  
  const [simulation, setSimulation] = useState({
    title: '',
    description: '',
    duration: 60,
    isBlindMode: true,
    isPublished: false,
  })
  
  const [steps, setSteps] = useState<SimulationStep[]>([
    {
      id: '1',
      type: 'AI_CHAT',
      title: 'System Design Discussion',
      instructions: 'Discuss the architecture for a scalable system',
      content: {},
      aiPersona: 'Senior Engineering Manager',
    }
  ])
  
  const [rubric, setRubric] = useState<RubricCriteria[]>([
    {
      id: '1',
      name: 'Technical Skills',
      description: 'Demonstrated technical knowledge and skills',
      weight: 0.4,
    },
    {
      id: '2',
      name: 'Problem Solving',
      description: 'Ability to analyze and solve complex problems',
      weight: 0.3,
    },
    {
      id: '3',
      name: 'Communication',
      description: 'Clarity and effectiveness of communication',
      weight: 0.2,
    },
    {
      id: '4',
      name: 'Adaptability',
      description: 'Ability to adapt to new information and situations',
      weight: 0.1,
    },
  ])

  const handleAddStep = () => {
    const newStep: SimulationStep = {
      id: Date.now().toString(),
      type: 'AI_CHAT',
      title: 'New Step',
      instructions: 'Enter instructions here...',
      content: {},
      aiPersona: 'Helpful Assistant',
    }
    setSteps([...steps, newStep])
  }

  const handleRemoveStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== id))
    } else {
      toast({
        title: "Cannot remove last step",
        description: "A simulation must have at least one step",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStep = (id: string, updates: Partial<SimulationStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ))
  }

  const handleAddRubricCriteria = () => {
    const newCriteria: RubricCriteria = {
      id: Date.now().toString(),
      name: 'New Criteria',
      description: 'Description of criteria',
      weight: 0.1,
    }
    setRubric([...rubric, newCriteria])
  }

  const handleRemoveRubricCriteria = (id: string) => {
    if (rubric.length > 1) {
      setRubric(rubric.filter(criteria => criteria.id !== id))
    }
  }

  const validateSimulation = () => {
    const errors: string[] = []
    
    if (!simulation.title.trim()) {
      errors.push('Title is required')
    }
    
    if (simulation.duration < 5) {
      errors.push('Duration must be at least 5 minutes')
    }
    
    if (simulation.duration > 240) {
      errors.push('Duration cannot exceed 4 hours')
    }
    
    steps.forEach((step, index) => {
      if (!step.title.trim()) {
        errors.push(`Step ${index + 1}: Title is required`)
      }
      if (!step.instructions.trim()) {
        errors.push(`Step ${index + 1}: Instructions are required`)
      }
    })
    
    const totalWeight = rubric.reduce((sum, criteria) => sum + criteria.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.01) {
      errors.push('Rubric weights must sum to 100%')
    }
    
    return errors
  }

  const handleSave = async (publish: boolean = false) => {
    const errors = validateSimulation()
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join('\n'),
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const data = {
        ...simulation,
        isPublished: publish,
        steps: steps.map(({ id, ...rest }) => rest),
        rubric: {
          criteria: rubric.map(({ id, ...rest }) => rest),
          passingScore: 70,
        },
      }
      
      const response = await simulationApi.create(data)
      
      toast({
        title: publish ? "Simulation Published!" : "Simulation Saved",
        description: publish 
          ? "Your simulation is now live and ready for candidates"
          : "Your simulation has been saved as a draft",
      })
      
      navigate(`/simulations/${response.data.id}`)
    } catch (error) {
      console.error('Failed to save simulation:', error)
      toast({
        title: "Error",
        description: "Failed to save simulation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const stepTypes = [
    { value: 'AI_CHAT', label: 'AI Chat', description: 'Interactive conversation with AI persona' },
    { value: 'CODE_REVIEW', label: 'Code Review', description: 'Review and fix provided code' },
    { value: 'DOCUMENT_ANALYSIS', label: 'Document Analysis', description: 'Analyze and respond to documents' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', description: 'Select correct answers from options' },
  ]

  const totalWeight = rubric.reduce((sum, criteria) => sum + criteria.weight, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Simulation Builder</h1>
              <p className="text-muted-foreground">
                Create realistic job simulations to assess candidate skills
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSave(false)}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                onClick={() => handleSave(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publish Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How candidates will see your simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{simulation.title || 'Untitled Simulation'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {simulation.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{simulation.duration} minutes</span>
                    {simulation.isBlindMode && (
                      <Badge variant="secondary">Blind Mode</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Steps ({steps.length})</h4>
                  <div className="space-y-1">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center justify-between rounded border p-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span>{step.title}</span>
                        </div>
                        <Badge variant="secondary">{step.type.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {Math.abs(totalWeight - 1) > 0.01 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Rubric weights sum to {(totalWeight * 100).toFixed(1)}%. Must equal 100%.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="rubric">Rubric</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Basics Tab */}
              <TabsContent value="basics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Details</CardTitle>
                    <CardDescription>
                      Basic information about your simulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Software Engineer Assessment"
                        value={simulation.title}
                        onChange={(e) => setSimulation({...simulation, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what candidates will be assessed on..."
                        value={simulation.description}
                        onChange={(e) => setSimulation({...simulation, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="duration"
                          type="number"
                          min="5"
                          max="240"
                          value={simulation.duration}
                          onChange={(e) => setSimulation({...simulation, duration: parseInt(e.target.value) || 60})}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">5-240 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Steps Tab */}
              <TabsContent value="steps" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Simulation Steps</CardTitle>
                        <CardDescription>
                          Add steps to create a multi-stage assessment
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddStep} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Step
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {steps.map((step, index) => (
                      <Card key={step.id} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">Step {index + 1}</Badge>
                              <Input
                                value={step.title}
                                onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                                className="font-semibold"
                                placeholder="Step Title"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStep(step.id)}
                              disabled={steps.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Step Type</Label>
                              <Select
                                value={step.type}
                                onValueChange={(value) => handleUpdateStep(step.id, { 
                                  type: value as any,
                                  content: {},
                                  aiPersona: value === 'AI_CHAT' ? 'Helpful Assistant' : undefined
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {stepTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex flex-col">
                                        <span>{type.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {type.description}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {step.type === 'AI_CHAT' && (
                              <div className="space-y-2">
                                <Label>AI Persona</Label>
                                <Input
                                  placeholder="e.g., Impatient Manager, Helpful Mentor"
                                  value={step.aiPersona || ''}
                                  onChange={(e) => handleUpdateStep(step.id, { aiPersona: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Instructions *</Label>
                            <Textarea
                              placeholder="Provide clear instructions for the candidate..."
                              value={step.instructions}
                              onChange={(e) => handleUpdateStep(step.id, { instructions: e.target.value })}
                              rows={3}
                            />
                          </div>
                          
                          {step.type === 'CODE_REVIEW' && (
                            <div className="space-y-2">
                              <Label>Code to Review</Label>
                              <Textarea
                                placeholder="Paste the code that candidates will review..."
                                value={step.content?.code || ''}
                                onChange={(e) => handleUpdateStep(step.id, { 
                                  content: { ...step.content, code: e.target.value }
                                })}
                                rows={8}
                                className="font-mono"
                              />
                            </div>
                          )}
                          
                          {step.type === 'DOCUMENT_ANALYSIS' && (
                            <div className="space-y-2">
                              <Label>Document Content</Label>
                              <Textarea
                                placeholder="Paste the document content for analysis..."
                                value={step.content?.document || ''}
                                onChange={(e) => handleUpdateStep(step.id, { 
                                  content: { ...step.content, document: e.target.value }
                                })}
                                rows={8}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rubric Tab */}
              <TabsContent value="rubric" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Grading Rubric</CardTitle>
                        <CardDescription>
                          Define how submissions will be evaluated
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddRubricCriteria} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Criteria
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Weight: {(totalWeight * 100).toFixed(1)}%</span>
                        <span className={Math.abs(totalWeight - 1) > 0.01 ? 'text-destructive' : 'text-green-600'}>
                          {Math.abs(totalWeight - 1) > 0.01 ? 'Must equal 100%' : '✓ Valid'}
                        </span>
                      </div>
                      
                      {rubric.map((criteria, index) => (
                        <Card key={criteria.id} className="relative">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">Criteria {index + 1}</Badge>
                                  <Input
                                    value={criteria.name}
                                    onChange={(e) => {
                                      const newRubric = [...rubric]
                                      newRubric[index].name = e.target.value
                                      setRubric(newRubric)
                                    }}
                                    className="font-semibold"
                                    placeholder="Criteria Name"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Input
                                    value={criteria.description}
                                    onChange={(e) => {
                                      const newRubric = [...rubric]
                                      newRubric[index].description = e.target.value
                                      setRubric(newRubric)
                                    }}
                                    placeholder="Describe what this criteria measures"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Weight: {(criteria.weight * 100).toFixed(0)}%</Label>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="5"
                                      value={criteria.weight * 100}
                                      onChange={(e) => {
                                        const newRubric = [...rubric]
                                        newRubric[index].weight = parseInt(e.target.value) / 100
                                        setRubric(newRubric)
                                      }}
                                      className="flex-1"
                                    />
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={Math.round(criteria.weight * 100)}
                                      onChange={(e) => {
                                        const newRubric = [...rubric]
                                        newRubric[index].weight = parseInt(e.target.value) / 100
                                        setRubric(newRubric)
                                      }}
                                      className="w-20"
                                    />
                                    <span className="text-sm">%</span>
                                  </div>
                                </div>
                              </div>
                              
                              {rubric.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRubricCriteria(criteria.id)}
                                  className="ml-4"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Settings</CardTitle>
                    <CardDescription>
                      Configure advanced options for your simulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="blind-mode">Blind Hiring Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Hide candidate names and demographics during evaluation
                        </p>
                      </div>
                      <Switch
                        id="blind-mode"
                        checked={simulation.isBlindMode}
                        onCheckedChange={(checked) => 
                          setSimulation({...simulation, isBlindMode: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="anti-cheat">Anti-Cheat Protection</Label>
                        <p className="text-sm text-muted-foreground">
                          Monitor tab switching and disable copy/paste
                        </p>
                      </div>
                      <Switch
                        id="anti-cheat"
                        checked={true}
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-evaluation">AI-Powered Evaluation</Label>
                        <p className="text-sm text-muted-foreground">
                          Use AI to automatically grade submissions
                        </p>
                      </div>
                      <Switch
                        id="ai-evaluation"
                        checked={true}
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="time-limit">Time Limit Enforcement</Label>
                        <p className="text-sm text-muted-foreground">
                          Auto-submit when time expires
                        </p>
                      </div>
                      <Switch
                        id="time-limit"
                        checked={true}
                        disabled
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationBuilder