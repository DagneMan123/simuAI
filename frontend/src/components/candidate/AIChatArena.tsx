import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  AlertTriangle,
  Code,
  Type,
  FileText,
  Image as ImageIcon,
  Smile,
  Paperclip,
  MoreVertical,
  Bot,
  User,
  Sparkles,
  Brain,
  Zap,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'code' | 'image' | 'question';
  isThinking?: boolean;
  codeLanguage?: string;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'coding' | 'text';
  options?: string[];
  correctAnswer?: string;
  timeLimit: number; // in minutes
  points: number;
}

const AIChatArena: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI interviewer for today's Frontend Developer assessment. I'll be asking you a series of questions to evaluate your skills. Are you ready to begin?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: 'text'
    },
    {
      id: '2',
      content: "Yes, I'm ready to start the assessment.",
      sender: 'user',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      type: 'text'
    },
    {
      id: '3',
      content: "Great! Let's start with a JavaScript question. Explain the difference between `let`, `const`, and `var` in JavaScript.",
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
      type: 'question'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isThinking, setIsThinking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const questions: Question[] = [
    {
      id: '1',
      question: "Explain the difference between `let`, `const`, and `var` in JavaScript.",
      type: 'text',
      timeLimit: 5,
      points: 10
    },
    {
      id: '2',
      question: "Write a function that reverses a string without using the built-in reverse method.",
      type: 'coding',
      timeLimit: 10,
      points: 15,
      correctAnswer: "function reverseString(str) {\n  let reversed = '';\n  for (let i = str.length - 1; i >= 0; i--) {\n    reversed += str[i];\n  }\n  return reversed;\n}"
    },
    {
      id: '3',
      question: "Which of the following is NOT a React hook?",
      type: 'multiple-choice',
      options: ['useState', 'useEffect', 'useComponent', 'useContext'],
      correctAnswer: 'useComponent',
      timeLimit: 2,
      points: 5
    }
  ];

  useEffect(() => {
    if (!currentQuestion && questions.length > 0) {
      setCurrentQuestion(questions[0]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate AI thinking
    setIsThinking(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a good explanation. Now, let's move to the next question: " + 
                 (currentQuestion?.question || "Write a function that reverses a string without using the built-in reverse method."),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTimeUp = () => {
    const timeUpMessage: Message = {
      id: Date.now().toString(),
      content: "⏰ Time's up! Please submit your answer or request an extension.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, timeUpMessage]);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;
    
    const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
    const nextIndex = (currentIndex + 1) % questions.length;
    setCurrentQuestion(questions[nextIndex]);
    
    const nextQuestionMessage: Message = {
      id: Date.now().toString(),
      content: `Next question: ${questions[nextIndex].question}`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'question'
    };
    
    setMessages(prev => [...prev, nextQuestionMessage]);
    setTimeLeft(questions[nextIndex].timeLimit * 60);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    const submitMessage: Message = {
      id: Date.now().toString(),
      content: `✅ Submitted answer for question: "${currentQuestion.question}"`,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, submitMessage]);
    handleNextQuestion();
  };

  const handleRequestHint = () => {
    if (!currentQuestion) return;
    
    const hintMessage: Message = {
      id: Date.now().toString(),
      content: `💡 Hint: ${currentQuestion.type === 'coding' ? 'Try using a loop to iterate through the string' : 'Think about scope and hoisting differences'}`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, hintMessage]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'code':
        return (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="bg-gray-800">
                <Code className="h-3 w-3 mr-1" />
                {message.codeLanguage || 'javascript'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-6 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <pre className="whitespace-pre-wrap">{message.content}</pre>
          </div>
        );
      
      case 'question':
        return (
          <div className="border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <FileText className="h-3 w-3 mr-1" />
                Question
              </Badge>
              {currentQuestion && (
                <>
                  <Badge variant="outline" className="text-xs">
                    <Timer className="h-3 w-3 mr-1" />
                    {currentQuestion.timeLimit} min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.points} points
                  </Badge>
                </>
              )}
            </div>
            <p className="font-medium text-gray-800">{message.content}</p>
            {currentQuestion?.type === 'multiple-choice' && currentQuestion.options && (
              <div className="mt-4 space-y-2">
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
                    <div className="w-4 h-4 border rounded-full border-gray-300" />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">AI Interview Arena</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Frontend Developer Assessment
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  AI Proctored
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <Progress 
                value={(timeLeft / (currentQuestion?.timeLimit || 25) * 60) * 100} 
                className="h-1 mt-2 bg-gray-700"
              />
            </div>
            
            {/* Media Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={isRecording ? 'bg-red-50 border-red-200 text-red-600' : ''}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={isVideoOn ? 'bg-green-50 border-green-200 text-green-600' : ''}
              >
                {isVideoOn ? <VideoOff size={18} /> : <Video size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Chat Panel */}
        <div className="lg:col-span-2 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="code">Code Editor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col">
              {/* Messages Container */}
              <Card className="flex-1 overflow-hidden mb-4">
                <CardContent className="p-4 h-full overflow-y-auto">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          {/* Sender Info */}
                          <div className={`flex items-center gap-2 mb-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.sender === 'ai' 
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                                : 'bg-gradient-to-br from-green-500 to-green-600'
                            }`}>
                              {message.sender === 'ai' ? (
                                <Bot className="h-3 w-3 text-white" />
                              ) : (
                                <User className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="text-xs font-medium">
                              {message.sender === 'ai' ? 'AI Interviewer' : 'You'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {/* Message Bubble */}
                          <div className={`
                            rounded-2xl p-4
                            ${message.sender === 'ai' 
                              ? 'bg-white border border-gray-200' 
                              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            }
                            ${message.type === 'question' ? 'border-2 border-blue-200' : ''}
                          `}>
                            {renderMessageContent(message)}
                            
                            {/* Actions */}
                            <div className={`flex gap-2 mt-3 ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                              {message.sender === 'ai' && (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 px-2">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 px-2">
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2"
                                    onClick={() => copyToClipboard(message.content)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%]">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-medium">AI Interviewer</span>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
              </Card>

              {/* Input Area */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleRequestHint}>
                    💡 Request Hint
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextQuestion}>
                    ⏭️ Next Question
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('code')}>
                    <Code className="h-4 w-4 mr-2" />
                    Open Code Editor
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-green-700"
                    onClick={handleSubmitAnswer}
                  >
                    ✅ Submit Answer
                  </Button>
                </div>
                
                {/* Input Box */}
                <div className="relative">
                  <Textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your answer here... (Shift + Enter for new line)"
                    className="min-h-[100px] pr-24 resize-none"
                    disabled={isThinking}
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isThinking}
                    >
                      <Paperclip size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isThinking}
                    >
                      <ImageIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isThinking}
                    >
                      <Smile size={18} />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isThinking}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      size="icon"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>AI responses are analyzed for technical accuracy and communication skills</span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Questions Tab */}
            <TabsContent value="questions" className="flex-1">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Assessment Questions</h3>
                      <Badge variant="outline">
                        {questions.length} Questions
                      </Badge>
                    </div>
                    
                    {questions.map((question, idx) => (
                      <div 
                        key={question.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          currentQuestion?.id === question.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentQuestion(question)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{idx + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{question.question}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.type === 'coding' ? (
                                    <Code className="h-3 w-3 mr-1" />
                                  ) : question.type === 'multiple-choice' ? (
                                    <Type className="h-3 w-3 mr-1" />
                                  ) : (
                                    <FileText className="h-3 w-3 mr-1" />
                                  )}
                                  {question.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Timer className="h-3 w-3 mr-1" />
                                  {question.timeLimit} min
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.points} points
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {currentQuestion?.id === question.id && (
                            <Badge className="bg-blue-100 text-blue-700">Current</Badge>
                          )}
                        </div>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="ml-11 space-y-2">
                            {question.options.map((option, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50">
                                <div className="w-4 h-4 border rounded-full border-gray-300" />
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">Attempt</Button>
                          <Button variant="outline" size="sm">View Solution</Button>
                          <Button variant="outline" size="sm">Bookmark</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Code Editor Tab */}
            <TabsContent value="code" className="flex-1">
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col h-full">
                    {/* Editor Header */}
                    <div className="border-b p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Code className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">Code Editor</h3>
                            <p className="text-sm text-gray-500">Write and test your code here</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Select defaultValue="javascript">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline">Run Code</Button>
                          <Button>Submit Code</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Editor Content */}
                    <div className="flex-1 grid grid-cols-2">
                      {/* Code Input */}
                      <div className="border-r">
                        <div className="p-4 border-b">
                          <h4 className="font-medium">main.js</h4>
                        </div>
                        <div className="p-4 font-mono text-sm">
                          <pre className="text-gray-800">{`function reverseString(str) {
  // Write your solution here
  let reversed = '';
  
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  
  return reversed;
}

// Test cases
console.log(reverseString("hello")); // Should return "olleh"
console.log(reverseString("world")); // Should return "dlrow"
console.log(reverseString("12345")); // Should return "54321"`}</pre>
                        </div>
                      </div>
                      
                      {/* Output */}
                      <div>
                        <div className="p-4 border-b">
                          <h4 className="font-medium">Output</h4>
                        </div>
                        <div className="p-4">
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                            <div className="text-green-400">$ node main.js</div>
                            <div className="mt-2">olleh</div>
                            <div>dlrow</div>
                            <div>54321</div>
                            <div className="mt-4 text-green-400">✓ All tests passed!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right: Side Panel */}
        <div className="space-y-6">
          {/* Current Question */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Current Question</h3>
                  <p className="text-sm text-gray-500">Question {questions.findIndex(q => q.id === currentQuestion?.id) + 1} of {questions.length}</p>
                </div>
              </div>
              
              {currentQuestion && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-medium">{currentQuestion.question}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentQuestion.timeLimit}</div>
                      <div className="text-sm text-gray-500">Minutes Left</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentQuestion.points}</div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                    Submit Answer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">AI Analysis</h3>
                  <p className="text-sm text-gray-500">Real-time feedback</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Accuracy</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Code Quality</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Communication</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Suggestions: Consider adding comments to your code</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Tools */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Quick Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <Copy className="h-5 w-5" />
                  <span className="text-xs">Copy Code</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <Type className="h-5 w-5" />
                  <span className="text-xs">Format Code</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="text-xs">Time Extension</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
                  <HelpCircle className="h-5 w-5" />
                  <span className="text-xs">Request Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatArena;