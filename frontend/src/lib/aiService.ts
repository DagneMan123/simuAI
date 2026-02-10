import api from './api';

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'coding' | 'essay' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number; 
  explanation?: string;
  flagged?: boolean;
}

export interface AssessmentSession {
  id: string;
  questions: Question[];
  timeLimit: number; // 
  startedAt: string;
  expiresAt: string;
  examType: string;
  status: 'active' | 'completed' | 'expired';
}

export interface AnswerSubmission {
  questionId: string;
  answer: string;
  timeSpent: number; // በሚሊሰከንድ
  codeLanguage?: string; // ለኮድ ጥያቄዎች
}

export interface AssessmentResult {
  id: string;
  sessionId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // በሰከንድ
  submittedAt: string;
  detailedFeedback: QuestionFeedback[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  percentile: number; // ከሌሎች ተማሪዎች ጋር ሲነፃፀር
}

export interface QuestionFeedback {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer?: string;
  feedback: string;
  explanation: string;
  timeSpent: number;
}

export interface AIAnalysis {
  weaknesses: string[];
  strengths: string[];
  recommendations: string[];
  estimatedLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  nextAssessmentDate: string;
}

export const aiService = {
  // ከAI ጋር መስራት
  async startAssessment(examType: string): Promise<AssessmentSession> {
    try {
      const response = await api.post('/ai/assessments/start', { examType });
      return response.data;
    } catch (error) {
      console.error('Start assessment error:', error);
      throw error;
    }
  },

  async submitAnswers(
    sessionId: string, 
    answers: AnswerSubmission[]
  ): Promise<AssessmentResult> {
    try {
      const response = await api.post(`/ai/assessments/${sessionId}/submit`, { answers });
      return response.data;
    } catch (error) {
      console.error('Submit answers error:', error);
      throw error;
    }
  },

  async getFeedback(
    question: string, 
    answer: string,
    questionType: string
  ): Promise<{ feedback: string; score: number; suggestions: string[] }> {
    try {
      const response = await api.post('/ai/feedback', { 
        question, 
        answer, 
        questionType 
      });
      return response.data;
    } catch (error) {
      console.error('Get feedback error:', error);
      throw error;
    }
  },

  async generateQuestions(
    topic: string, 
    count: number = 5,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<Question[]> {
    try {
      const response = await api.post('/ai/questions/generate', { 
        topic, 
        count, 
        difficulty 
      });
      return response.data;
    } catch (error) {
      console.error('Generate questions error:', error);
      throw error;
    }
  },

  async analyzeWeaknesses(
    userId: string
  ): Promise<AIAnalysis> {
    try {
      const response = await api.get(`/ai/analysis/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Analyze weaknesses error:', error);
      throw error;
    }
  },

  async getAssessmentHistory(): Promise<AssessmentResult[]> {
    try {
      const response = await api.get('/ai/assessments/history');
      return response.data;
    } catch (error) {
      console.error('Get assessment history error:', error);
      throw error;
    }
  },

  async getAssessmentResult(resultId: string): Promise<AssessmentResult> {
    try {
      const response = await api.get(`/ai/assessments/results/${resultId}`);
      return response.data;
    } catch (error) {
      console.error('Get assessment result error:', error);
      throw error;
    }
  },

  async savePracticeSession(questions: Question[], answers: AnswerSubmission[]): Promise<{ id: string }> {
    try {
      const response = await api.post('/ai/practice/save', { questions, answers });
      return response.data;
    } catch (error) {
      console.error('Save practice session error:', error);
      throw error;
    }
  },

  async getPersonalizedStudyPlan(): Promise<{
    dailyGoals: string[];
    weeklySchedule: any[];
    resources: Array<{ title: string; url: string; type: string }>;
  }> {
    try {
      const response = await api.get('/ai/study-plan');
      return response.data;
    } catch (error) {
      console.error('Get study plan error:', error);
      throw error;
    }
  },

  async compareWithPeers(userId: string): Promise<{
    userScore: number;
    averageScore: number;
    percentile: number;
    topSkills: string[];
    areasToImprove: string[];
  }> {
    try {
      const response = await api.get(`/ai/compare/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Compare with peers error:', error);
      throw error;
    }
  },

  // የAI ቻትቦት ለመጠየቅ
  async askAI(query: string, context?: string): Promise<{
    answer: string;
    sources?: string[];
    followUpQuestions?: string[];
  }> {
    try {
      const response = await api.post('/ai/chat', { query, context });
      return response.data;
    } catch (error) {
      console.error('Ask AI error:', error);
      throw error;
    }
  },

  // የምስል ትንተና (ለምሳሌ፡ የተፃፈ መልስ ለመተርጎም)
  async analyzeImage(imageFile: File): Promise<{
    text: string;
    analysis: string;
    confidence: number;
  }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/ai/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Analyze image error:', error);
      throw error;
    }
  },

  // የንግግር ማወቂያ (ለቃለ መጠይቅ ምላሽ)
  async speechToText(audioFile: File): Promise<{
    text: string;
    confidence: number;
  }> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      const response = await api.post('/ai/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Speech to text error:', error);
      throw error;
    }
  },
};