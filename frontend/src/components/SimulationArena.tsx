import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Clock,
  Save,
  Send,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import { api } from '@/lib/api'
import { io, Socket } from 'socket.io-client'

interface SimulationStep {
  id: string
  type: 'AI_CHAT' | 'CODE_REVIEW' | 'DOCUMENT_ANALYSIS'
  title: string
  instructions: string
  content: any
  aiPersona?: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

const SimulationArena: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SimulationStep[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [integrityWarnings, setIntegrityWarnings] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'Welcome to the simulation! How can I assist you today?', timestamp: new Date() }
  ])
  const [userInput, setUserInput] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [documentInput, setDocumentInput] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000')
    
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-simulation', { simulationId: id })
    })

    socketRef.current.on('candidate-activity', (data) => {
      console.log('Activity detected:', data)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [id])

  // Load simulation data
  useEffect(() => {
    const loadSimulation = async () => {
      try {
        const response = await api.get(`/simulations/${id}`)
        setSteps(response.data.steps)
      } catch (error) {
        console.error('Failed to load simulation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSimulation()
  }, [id])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Anti-cheat monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const warning = 'Tab switch detected at ' + new Date().toLocaleTimeString()
        setIntegrityWarnings((prev) => [...prev, warning])
        socketRef.current?.emit('integrity-event', {
          simulationId: id,
          type: 'TAB_SWITCH',
          timestamp: new Date()
        })
      }
    }

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      const warning = 'Copy attempt blocked at ' + new Date().toLocaleTimeString()
      setIntegrityWarnings((prev) => [...prev, warning])
      socketRef.current?.emit('integrity-event', {
        simulationId: id,
        type: 'COPY_ATTEMPT',
        timestamp: new Date()
      })
    }

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const warning = 'Paste attempt blocked at ' + new Date().toLocaleTimeString()
      setIntegrityWarnings((prev) => [...prev, warning])
      socketRef.current?.emit('integrity-event', {
        simulationId: id,
        type: 'PASTE_ATTEMPT',
        timestamp: new Date()
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
    }
  }, [id])

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleAutoSubmit = async () => {
    try {
      await api.post(`/simulations/${id}/complete`)
      navigate('/submission-complete', { state: { autoSubmit: true } })
    } catch (error) {
      console.error('Auto-submit failed:', error)
    }
  }

  const handleSubmitStep = async () => {
    setIsSubmitting(true)
    try {
      const currentStepData = steps[currentStep]
      let content = {}

      switch (currentStepData.type) {
        case 'AI_CHAT':
          content = { messages: chatMessages }
          break
        case 'CODE_REVIEW':
          content = { code: codeInput }
          break
        case 'DOCUMENT_ANALYSIS':
          content = { document: documentInput }
          break
      }

      await api.post(`/simulations/${id}/steps/${currentStepData.id}/submit`, {
        content,
        integrityFlags: integrityWarnings
      })

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setChatMessages([{ role: 'system', content: 'Next question:', timestamp: new Date() }])
        setCodeInput('')
        setDocumentInput('')
        setUserInput('')
      } else {
        await api.post(`/simulations/${id}/complete`)
        navigate('/submission-complete')
      }
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const newMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setChatMessages([...chatMessages, newMessage])
    setUserInput('')

    try {
      const response = await api.post('/ai/chat', {
        messages: [...chatMessages, newMessage],
        persona: steps[currentStep].aiPersona,
        simulationId: id,
        stepId: steps[currentStep].id
      })

      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      }

      setChatMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('AI chat failed:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen simulation-arena">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">{currentStepData.title}</h1>
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Badge variant="secondary">
                {currentStepData.type.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 300 ? 'text-red-600' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleAutoSubmit}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-2 h-1" />
        </div>
      </div>

      {/* Integrity Warnings */}
      {integrityWarnings.length > 0 && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {integrityWarnings.length} integrity warning(s) recorded
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Instructions */}
          <Card className="sticky top-24 h-fit">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Secure Environment Active</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p>{currentStepData.instructions}</p>
              </div>
              {currentStepData.aiPersona && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">AI Persona:</p>
                  <p className="mt-1 text-sm italic">"{currentStepData.aiPersona}"</p>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-medium">Requirements:</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Do not switch tabs or applications</li>
                  <li>Copy/paste is disabled</li>
                  <li>All actions are monitored</li>
                  <li>Submit before time runs out</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Interactive Area */}
          <Card>
            <CardHeader>
              <CardTitle>Your Response</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStepData.type === 'AI_CHAT' && (
                <div className="space-y-4">
                  <div
                    ref={chatContainerRef}
                    className="h-96 overflow-y-auto rounded-lg border p-4"
                  >
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                      >
                        <div
                          className={`inline-block rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStepData.type === 'CODE_REVIEW' && (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-black p-4 font-mono text-sm text-white">
                    <pre className="whitespace-pre-wrap">{currentStepData.content.code}</pre>
                  </div>
                  <Textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Write your code review here..."
                    className="min-h-[300px] font-mono"
                  />
                </div>
              )}

              {currentStepData.type === 'DOCUMENT_ANALYSIS' && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <p className="whitespace-pre-wrap">{currentStepData.content.document}</p>
                  </div>
                  <Textarea
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    placeholder="Write your analysis here..."
                    className="min-h-[300px]"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleSubmitStep}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    'Complete Assessment'
                  ) : (
                    'Next Step'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SimulationArena