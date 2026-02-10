const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const axios = require('axios');

const prisma = new PrismaClient();

// Helper function to call AI API (Groq, OpenAI, or Anthropic)
async function callAI(prompt, systemMessage = 'You are a helpful AI assistant.') {
  try {
    // Try Groq first (free and fast)
    if (process.env.GROQ_API_KEY) {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    }

    // Fallback to Anthropic Claude
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.content[0].text;
    }

    throw new Error('No AI API key configured');
  } catch (error) {
    console.error('AI API error:', error.response?.data || error.message);
    throw error;
  }
}

class AIController {
  /**
   * @route   POST /api/ai/evaluate
   * @desc    Evaluate candidate submission with AI
   * @access  Private (Employer/Admin)
   */
  static async evaluateSubmission(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { submission, rubric, expectedOutput } = req.body;

      const prompt = `
You are an expert evaluator. Evaluate the following candidate submission:

SUBMISSION:
${JSON.stringify(submission, null, 2)}

EVALUATION RUBRIC:
${JSON.stringify(rubric, null, 2)}

${expectedOutput ? `EXPECTED OUTPUT:\n${JSON.stringify(expectedOutput, null, 2)}` : ''}

Provide a detailed evaluation with:
1. Overall score (0-100)
2. Technical accuracy score (0-100)
3. Code quality score (0-100) if applicable
4. Communication score (0-100)
5. Detailed feedback
6. Strengths (array of strings)
7. Areas for improvement (array of strings)
8. Recommendations (array of strings)

Return as JSON object.
      `;

      const aiResponse = await callAI(
        prompt,
        'You are an expert technical evaluator and HR specialist.'
      );

      const evaluation = JSON.parse(aiResponse);

      res.json({
        success: true,
        data: { evaluation }
      });
    } catch (error) {
      console.error('AI evaluation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to evaluate submission',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/generate-questions
   * @desc    Generate assessment questions using AI
   * @access  Private (Employer/Admin)
   */
  static async generateQuestions(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { jobTitle, difficulty = 'medium', count = 5, skills = [] } = req.body;

      const prompt = `
Generate ${count} interview questions for a ${jobTitle} position.

Difficulty level: ${difficulty}
Required skills: ${skills.join(', ')}

For each question, provide:
1. questionText: The question itself
2. questionType: "TECHNICAL", "BEHAVIORAL", or "SITUATIONAL"
3. difficulty: "EASY", "MEDIUM", or "HARD"
4. expectedKeywords: Array of key terms expected in good answers
5. evaluationCriteria: What to look for in the answer
6. sampleAnswer: A good example answer

Return as JSON array of ${count} questions.
      `;

      const aiResponse = await callAI(
        prompt,
        'You are an expert HR specialist and technical interviewer.'
      );

      const questions = JSON.parse(aiResponse);

      res.json({
        success: true,
        data: { questions }
      });
    } catch (error) {
      console.error('Question generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate questions',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/career-advice
   * @desc    Get personalized career advice
   * @access  Private (Candidate)
   */
  static async getCareerAdvice(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { skills, experience, goals, assessmentResults } = req.body;

      const prompt = `
Provide personalized career advice for a candidate with:

SKILLS: ${skills.join(', ')}
EXPERIENCE: ${experience}
CAREER GOALS: ${goals}
RECENT ASSESSMENT RESULTS: ${JSON.stringify(assessmentResults, null, 2)}

Provide:
1. Career path recommendations
2. Skills to develop
3. Learning resources
4. Job market insights
5. Salary expectations
6. Next steps

Return as JSON object.
      `;

      const aiResponse = await callAI(
        prompt,
        'You are an expert career counselor and industry analyst.'
      );

      const advice = JSON.parse(aiResponse);

      res.json({
        success: true,
        data: { advice }
      });
    } catch (error) {
      console.error('Career advice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate career advice',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/analyze-interview
   * @desc    Analyze mock interview recording
   * @access  Private (Candidate)
   */
  static async analyzeInterview(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No audio file provided',
        });
      }

      // In production, you would:
      // 1. Transcribe audio using Whisper API or similar
      // 2. Analyze the transcript with AI

      // Mock response for now
      const analysis = {
        transcript: 'Mock transcript of the interview...',
        overallScore: 75,
        communicationScore: 80,
        technicalScore: 70,
        confidenceScore: 75,
        feedback: 'Good communication skills. Consider providing more specific examples.',
        strengths: ['Clear communication', 'Good structure'],
        improvements: ['More technical depth', 'Specific examples'],
        recommendations: [
          'Practice STAR method for behavioral questions',
          'Review technical concepts',
        ],
      };

      res.json({
        success: true,
        data: { analysis }
      });
    } catch (error) {
      console.error('Interview analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze interview',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/chat
   * @desc    AI chatbot for questions
   * @access  Private
   */
  static async chatWithAI(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { query, context } = req.body;

      const prompt = context
        ? `Context: ${context}\n\nQuestion: ${query}`
        : query;

      const aiResponse = await callAI(
        prompt,
        'You are a helpful AI assistant for a talent assessment platform. Provide clear, concise, and accurate answers.'
      );

      res.json({
        success: true,
        data: {
          answer: aiResponse,
          followUpQuestions: [
            'Can you explain more about this?',
            'What are the best practices?',
            'How can I improve?',
          ]
        }
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/feedback
   * @desc    Get AI feedback on answer
   * @access  Private
   */
  static async getFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { question, answer, questionType } = req.body;

      const prompt = `
Evaluate this answer:

QUESTION: ${question}
QUESTION TYPE: ${questionType}
CANDIDATE ANSWER: ${answer}

Provide:
1. score: 0-100
2. feedback: Detailed feedback
3. suggestions: Array of improvement suggestions
4. isCorrect: boolean (for technical questions)

Return as JSON object.
      `;

      const aiResponse = await callAI(
        prompt,
        'You are an expert evaluator providing constructive feedback.'
      );

      const feedback = JSON.parse(aiResponse);

      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate feedback',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/analyze-image
   * @desc    Analyze image (OCR, diagram analysis)
   * @access  Private
   */
  static async analyzeImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided',
        });
      }

      // In production, use OCR service or vision AI
      // For now, return mock data
      const analysis = {
        text: 'Extracted text from image...',
        analysis: 'This appears to be a code snippet or diagram...',
        confidence: 0.85,
      };

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze image',
        error: error.message,
      });
    }
  }

  /**
   * @route   POST /api/ai/speech-to-text
   * @desc    Convert speech to text
   * @access  Private
   */
  static async speechToText(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No audio file provided',
        });
      }

      // In production, use Whisper API or similar
      // For now, return mock data
      const result = {
        text: 'Transcribed text from audio...',
        confidence: 0.92,
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Speech to text error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to convert speech to text',
        error: error.message,
      });
    }
  }
}

module.exports = AIController;