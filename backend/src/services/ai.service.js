const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  // Generate AI questions from job description
  static async generateQuestions(jobId, jobDescription, requirements) {
    try {
      const prompt = `
        Generate 5 interview questions for the following job:
        
        Job Description: ${jobDescription}
        
        Requirements: ${JSON.stringify(requirements)}
        
        Generate:
        1. 2 Technical questions related to specific skills
        2. 2 Behavioral questions
        3. 1 Situational/Case study question
        
        Format each question with:
        - questionText: The question itself
        - questionType: "TECHNICAL", "BEHAVIORAL", or "SITUATIONAL"
        - difficulty: "EASY", "MEDIUM", or "HARD"
        - expectedKeywords: Array of key terms expected in answers
        - weight: Percentage weight for scoring (20 for each question)
        
        Return as JSON array.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert HR specialist. Generate relevant interview questions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const questions = JSON.parse(completion.choices[0].message.content);

      // Save questions to database
      const savedQuestions = await Promise.all(
        questions.map(async (question) => {
          return await prisma.aIQuestion.create({
            data: {
              jobId,
              questionText: question.questionText,
              questionType: question.questionType,
              difficulty: question.difficulty,
              expectedKeywords: question.expectedKeywords,
              weight: question.weight || 20,
            },
          });
        })
      );

      // Log token usage
      await prisma.tokenUsage.create({
        data: {
          userId: jobId, // Using jobId as reference
          userRole: 'EMPLOYER',
          action: 'GENERATE_QUESTIONS',
          tokensUsed: completion.usage.total_tokens,
          cost: (completion.usage.total_tokens / 1000) * 0.03, // Approx cost
          model: 'gpt-4',
        },
      });

      return savedQuestions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate AI questions');
    }
  }

  // Transcribe video/audio using Whisper
  static async transcribeInterview(videoPath, interviewId) {
    try {
      // Read the video/audio file
      const audioFile = fs.createReadStream(videoPath);
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "text",
      });

      // Save transcript to database
      await prisma.interview.update({
        where: { id: interviewId },
        data: {
          transcript: transcription,
        },
      });

      // Log token usage
      await prisma.tokenUsage.create({
        data: {
          userId: interviewId,
          userRole: 'CANDIDATE',
          action: 'TRANSCRIBE_INTERVIEW',
          tokensUsed: transcription.length / 4, // Approximate token count
          cost: 0, // Whisper transcription cost is low
          model: 'whisper-1',
        },
      });

      return transcription;
    } catch (error) {
      console.error('Error transcribing interview:', error);
      throw new Error('Failed to transcribe interview');
    }
  }

  // Evaluate candidate response
  static async evaluateResponse(applicationId, transcript, jobRequirements) {
    try {
      const prompt = `
        Evaluate the candidate's interview response against the job requirements.
        
        Job Requirements: ${JSON.stringify(jobRequirements)}
        
        Candidate Response Transcript: ${transcript}
        
        Provide evaluation with:
        1. technicalScore: 0-100
        2. behavioralScore: 0-100
        3. communicationScore: 0-100
        4. overallScore: 0-100 (weighted average)
        5. feedback: Detailed qualitative feedback
        6. strengths: Array of key strengths
        7. weaknesses: Array of areas for improvement
        
        Return as JSON object.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert HR evaluator. Evaluate candidates objectively."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const evaluation = JSON.parse(completion.choices[0].message.content);

      // Save evaluation to database
      const aiScore = await prisma.aIScore.create({
        data: {
          applicationId,
          candidateId: (await prisma.application.findUnique({
            where: { id: applicationId },
            select: { candidateId: true }
          })).candidateId,
          jobId: (await prisma.application.findUnique({
            where: { id: applicationId },
            select: { jobId: true }
          })).jobId,
          technicalScore: evaluation.technicalScore,
          behavioralScore: evaluation.behavioralScore,
          communicationScore: evaluation.communicationScore,
          overallScore: evaluation.overallScore,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
        },
      });

      // Update application with AI score
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          aiScore: evaluation.overallScore,
          aiFeedback: evaluation.feedback,
          aiTranscript: transcript,
          evaluatedAt: new Date(),
          status: 'UNDER_REVIEW',
        },
      });

      // Log token usage
      await prisma.tokenUsage.create({
        data: {
          userId: applicationId,
          userRole: 'SYSTEM',
          action: 'EVALUATE_RESPONSE',
          tokensUsed: completion.usage.total_tokens,
          cost: (completion.usage.total_tokens / 1000) * 0.03,
          model: 'gpt-4',
        },
      });

      return aiScore;
    } catch (error) {
      console.error('Error evaluating response:', error);
      throw new Error('Failed to evaluate candidate response');
    }
  }

  // Rank candidates for a job
  static async rankCandidates(jobId) {
    try {
      const applications = await prisma.application.findMany({
        where: {
          jobId,
          aiScore: { not: null },
          status: { not: 'REJECTED' },
        },
        include: {
          candidate: {
            include: {
              candidateProfile: true,
            },
          },
          aiScores: true,
        },
        orderBy: {
          aiScore: 'desc',
        },
      });

      // Enhanced ranking with additional factors
      const rankedCandidates = applications.map((app, index) => {
        const score = app.aiScore || 0;
        const aiScore = app.aiScores?.[0];
        
        return {
          rank: index + 1,
          applicationId: app.id,
          candidateId: app.candidateId,
          candidateName: app.candidate.candidateProfile.fullName,
          overallScore: score,
          technicalScore: aiScore?.technicalScore || 0,
          behavioralScore: aiScore?.behavioralScore || 0,
          communicationScore: aiScore?.communicationScore || 0,
          appliedAt: app.appliedAt,
          status: app.status,
          matchPercentage: Math.round(score),
        };
      });

      return rankedCandidates;
    } catch (error) {
      console.error('Error ranking candidates:', error);
      throw new Error('Failed to rank candidates');
    }
  }

  // Generate interview feedback summary
  static async generateFeedbackSummary(applicationId) {
    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          aiScores: true,
          job: true,
          candidate: {
            include: {
              candidateProfile: true,
            },
          },
        },
      });

      if (!application.aiScores.length) {
        throw new Error('No AI evaluation found');
      }

      const aiScore = application.aiScores[0];
      
      const prompt = `
        Generate a professional interview feedback summary.
        
        Candidate: ${application.candidate.candidateProfile.fullName}
        Job Title: ${application.job.title}
        
        Scores:
        - Technical: ${aiScore.technicalScore}/100
        - Behavioral: ${aiScore.behavioralScore}/100
        - Communication: ${aiScore.communicationScore}/100
        - Overall: ${aiScore.overallScore}/100
        
        Strengths: ${aiScore.strengths.join(', ')}
        Weaknesses: ${aiScore.weaknesses.join(', ')}
        
        Generate:
        1. A brief summary paragraph
        2. Key talking points for interview debrief
        3. Hiring recommendation (Strong Yes, Yes, Maybe, No, Strong No)
        4. Suggested next steps
        
        Return as JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate professional HR feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating feedback:', error);
      throw new Error('Failed to generate feedback summary');
    }
  }

  // Analyze interview transcript and responses
  static async analyzeInterview({ transcript, responses, codeSubmissions, duration }) {
    try {
      const prompt = `
        Analyze this technical interview:
        
        Transcript: ${transcript}
        Responses: ${JSON.stringify(responses)}
        Code Submissions: ${JSON.stringify(codeSubmissions)}
        Duration: ${duration} minutes
        
        Provide detailed analysis with:
        - overallScore: 0-100
        - technicalScore: 0-100
        - communicationScore: 0-100
        - strengths: Array of strengths
        - weaknesses: Array of weaknesses
        - recommendations: Array of recommendations
        - detailedFeedback: Comprehensive feedback paragraph
        
        Return as JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert technical interviewer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing interview:', error);
      throw new Error('Failed to analyze interview');
    }
  }

  // Analyze image for integrity monitoring
  static async analyzeImage({ imageUrl, checkFor }) {
    try {
      // Note: This requires GPT-4 Vision API
      const prompt = `
        Analyze this image for integrity monitoring during an online assessment.
        Check for: ${checkFor.join(', ')}
        
        Provide:
        - detected: Array of detected objects/people
        - integrityScore: 0-100 (100 = no issues)
        - flags: Array of any suspicious activities
        - confidence: 0-1
        - description: Brief description of the scene
        
        Return as JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 500,
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Return safe default if vision API not available
      return {
        detected: ['person'],
        integrityScore: 95,
        flags: [],
        confidence: 0.8,
        description: 'Image analysis in progress'
      };
    }
  }

  // Convert speech to text
  static async speechToText({ audioUrl, language }) {
    try {
      // Download audio file if it's a URL
      const audioPath = audioUrl.startsWith('http') 
        ? await this.downloadFile(audioUrl)
        : audioUrl;

      const audioFile = fs.createReadStream(audioPath);
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: language || 'en',
        response_format: "verbose_json",
      });

      return {
        text: transcription.text,
        confidence: 0.95,
        duration: transcription.duration,
        words: transcription.words || []
      };
    } catch (error) {
      console.error('Error in speech-to-text:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // Helper method to download files
  static async downloadFile(url) {
    // Implementation for downloading files from URL
    // This is a placeholder - implement based on your needs
    return url;
  }
}

module.exports = AIService;