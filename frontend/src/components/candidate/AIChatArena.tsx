import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, MicOff, Video, VideoOff, 
  Clock, AlertTriangle, Code,  FileText,  Paperclip, Bot, User, Sparkles, Brain,  ChevronRight, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// --- Interfaces ---
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'code' | 'question';
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
  // Remove sample questions - they should come from the simulation data via API
  // Questions will be loaded from the backend when the simulation starts

  // Fetch questions from API based on simulation
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Load questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Replace with actual API call to get simulation questions
        // const response = await api.get(`/simulations/${simulationId}/questions`);
        // setQuestions(response.data);
        
        // For now, initialize empty until API is called
        setQuestions([]);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };
    loadQuestions();
  }, []);
    {
      id: '1',
      content: "Hello! I'm your AI interviewer. Are you ready to begin the Frontend Developer assessment?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isThinking, setIsThinking] = useState(false);
  const [userCode, setUserCode] = useState('// Write your solution here...\n\nfunction solution() {\n  \n}');
  
  // Media States
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentQuestionIndex];

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // --- Handlers ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for that response. I've noted your input. Let's proceed with the current task.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      const systemMsg: Message = {
        id: Date.now().toString(),
        content: `Next Question: ${questions[nextIndex].question}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'question'
      };
      setMessages(prev => [...prev, systemMsg]);
      
      if (questions[nextIndex].type === 'coding') {
        setActiveTab('code');
      } else {
        setActiveTab('chat');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* --- Header --- */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Brain className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-none">AI Interview Arena</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-blue-500" />
              Frontend Engineering Level II
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-3">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="h-8 w-[1px] bg-gray-200 mx-2" />
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsMicOn(!isMicOn)} className={isMicOn ? 'text-green-600' : 'text-red-500'}>
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsVideoOn(!isVideoOn)} className={isVideoOn ? 'text-green-600' : 'text-red-500'}>
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Side: Interaction Zone */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-white border p-1 rounded-xl w-fit mb-4">
              <TabsTrigger value="chat" className="rounded-lg gap-2">
                <Bot className="h-4 w-4" /> Interview Chat
              </TabsTrigger>
              <TabsTrigger value="code" className="rounded-lg gap-2">
                <Code className="h-4 w-4" /> Code Editor
              </TabsTrigger>
              <TabsTrigger value="questions" className="rounded-lg gap-2">
                <FileText className="h-4 w-4" /> All Tasks
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0">
              <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-md">
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'ai' ? 'bg-white border text-gray-800' : 'bg-blue-600 text-white'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span className="text-[10px] opacity-50 mt-2 block">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot size={18} className="text-blue-600" /></div>
                      <div className="bg-white border p-4 rounded-2xl"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75" /><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150" /></div></div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Bar */}
                <div className="p-4 bg-white border-t space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('code')} className="text-blue-600 border-blue-200"><Code size={16} className="mr-2" /> Use Code Editor</Button>
                    <Button variant="outline" size="sm" onClick={handleNextQuestion} className="text-gray-600"><ChevronRight size={16} className="mr-2" /> Skip Question</Button>
                  </div>
                  <div className="relative">
                    <Textarea 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Explain your thought process..."
                      className="min-h-[80px] pr-20 py-4 rounded-xl border-gray-200 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-1">
                       <Button size="icon" variant="ghost" className="text-gray-400"><Paperclip size={20}/></Button>
                       <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isThinking} className="bg-blue-600 hover:bg-blue-700 rounded-lg h-10 w-10"><Send size={18} /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="flex-1 flex flex-col min-h-0">
               <Card className="flex-1 flex flex-col overflow-hidden shadow-md">
                  <div className="bg-gray-900 text-gray-400 p-3 flex justify-between items-center px-6">
                    <div className="flex items-center gap-2 text-sm font-mono"><div className="w-3 h-3 rounded-full bg-red-500"/><div className="w-3 h-3 rounded-full bg-yellow-500"/><div className="w-3 h-3 rounded-full bg-green-500"/><span className="ml-2">solution.js</span></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-300 hover:bg-gray-800"><Play size={14} className="mr-2 text-green-400"/> Run Test Cases</Button>
                      <Button size="sm" className="bg-blue-600">Submit Solution</Button>
                    </div>
                  </div>
                  <textarea 
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="flex-1 bg-gray-900 text-green-400 p-6 font-mono text-sm outline-none resize-none"
                    spellCheck="false"
                  />
                  <div className="h-32 bg-black text-gray-400 p-4 font-mono text-xs border-t border-gray-800 overflow-y-auto">
                    <div className="text-gray-600 mb-2">// Console Output</div>
                    <p className="text-green-500 font-bold">▶ Compiling code...</p>
                    <p className="text-gray-500 mt-1">Ready for execution.</p>
                  </div>
               </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="flex-1 overflow-y-auto">
              <div className="grid gap-4">
                {questions.map((q, i) => (
                  <Card key={q.id} className={i === currentQuestionIndex ? 'border-blue-500 ring-1 ring-blue-500' : ''}>
                    <CardContent className="p-6 flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">{i + 1}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{q.question}</h3>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">{q.type} • {q.points} Points</p>
                        </div>
                      </div>
                      {i < currentQuestionIndex ? <Badge className="bg-green-100 text-green-700">Completed</Badge> : i === currentQuestionIndex ? <Badge className="bg-blue-600">Current</Badge> : <Badge variant="outline">Locked</Badge>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Intelligence & Info Panel */}
        <div className="w-80 flex flex-col gap-6 shrink-0">
          <Card className="shadow-md border-none">
             <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2 text-gray-700"><FileText size={18} className="text-blue-500"/> Current Objective</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                   <p className="text-sm text-blue-900 font-medium leading-relaxed">{currentQuestion.question}</p>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between text-xs text-gray-500 font-medium"><span>TASK PROGRESS</span><span>{currentQuestionIndex + 1} / {questions.length}</span></div>
                   <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
                </div>
             </CardContent>
          </Card>

          <Card className="shadow-md border-none flex-1">
             <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2 text-gray-700"><Brain size={18} className="text-purple-500"/> AI Performance Analysis</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6 mt-2">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>TECHNICAL ACCURACY</span><span className="font-bold">85%</span></div>
                   <Progress value={85} className="h-1.5 bg-gray-100 shadow-inner" />
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>COMMUNICATION</span><span className="font-bold">92%</span></div>
                   <Progress value={92} className="h-1.5 bg-gray-100" color="bg-green-500" />
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>CODE QUALITY</span><span className="font-bold">78%</span></div>
                   <Progress value={78} className="h-1.5 bg-gray-100" color="bg-yellow-500" />
                </div>
                
                <div className="pt-4 border-t space-y-3">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Observations</h4>
                   <div className="flex gap-2 items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-yellow-800 leading-normal">Candidate demonstrates strong conceptual understanding but could be more concise.</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg font-bold">
            FINISH & SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatArena;