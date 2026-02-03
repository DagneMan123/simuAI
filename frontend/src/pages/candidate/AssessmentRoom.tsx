import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntegrity } from '../../hooks/useIntegrity';
import { aiService, Question, AnswerSubmission } from '../../services/aiService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Timer,
  NavigateBefore,
  NavigateNext,
  Flag,
  Warning,
} from '@mui/icons-material';

const AssessmentRoom: React.FC = () => {
  const { examType } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [warningCount, setWarningCount] = useState(0);

  // የኢንቲግሪቲ ማሻሻያን መጠቀም
  const { warningCount: integrityWarning, isActive } = useIntegrity({
    onWarning: (count) => {
      setWarningCount(count);
      if (count >= 3) {
        handleForceSubmit();
      }
    },
    onForceSubmit: handleForceSubmit,
  });

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const session = await aiService.startAssessment(examType || 'general');
      setQuestions(session.questions);
      setSessionId(session.id);
      setTimeLeft(session.timeLimit / 1000); // Convert to seconds
    } catch (error) {
      console.error('Failed to load assessment:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, [examType]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFlagQuestion = () => {
    // Mark question for review
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].flagged = true;
    setQuestions(updatedQuestions);
  };

  async function handleForceSubmit() {
    setSubmitting(true);
    try {
      const answerSubmissions: AnswerSubmission[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        timeSpent: 0, // This would be tracked per question
      }));

      await aiService.submitAnswers(sessionId, answerSubmissions);
      navigate('/my-results', { 
        state: { message: 'Assessment submitted due to integrity policy' }
      });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  }

  const handleSubmit = async () => {
    setShowSubmitDialog(false);
    setSubmitting(true);

    try {
      const answerSubmissions: AnswerSubmission[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        timeSpent: Math.floor(Math.random() * 300), // በተግባር ትክክለኛ ጊዜ ይለካል
      }));

      const result = await aiService.submitAnswers(sessionId, answerSubmissions);
      navigate('/my-results', { state: { result } });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading assessment...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Timer and Warnings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              {examType?.toUpperCase()} Assessment
            </Typography>
            
            <Box display="flex" alignItems="center" gap={3}>
              {warningCount > 0 && (
                <Alert severity="warning" icon={<Warning />} sx={{ py: 0 }}>
                  Warnings: {warningCount}/3
                </Alert>
              )}
              
              <Box display="flex" alignItems="center">
                <Timer sx={{ mr: 1 }} />
                <Typography variant="h6" color={timeLeft < 300 ? 'error' : 'primary'}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
              
              <Typography>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
            </Box>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* Integrity Warning */}
      {!isActive && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Warning: Tab switch detected! This is a violation of exam rules.
        </Alert>
      )}

      {/* Question Navigation */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <Box display="flex" gap={1}>
          {questions.map((q, idx) => (
            <IconButton
              key={q.id}
              size="small"
              color={idx === currentQuestionIndex ? 'primary' : 
                     answers[q.id] ? 'success' : 'default'}
              onClick={() => setCurrentQuestionIndex(idx)}
              sx={{ 
                border: q.flagged ? '2px solid orange' : '1px solid #ddd',
                width: 40, 
                height: 40 
              }}
            >
              {idx + 1}
            </IconButton>
          ))}
        </Box>
        
        <Button
          variant="outlined"
          endIcon={<NavigateNext />}
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </Button>
      </Box>

      {/* Current Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Typography variant="h6">
              {currentQuestion.text}
            </Typography>
            <IconButton onClick={handleFlagQuestion} color={currentQuestion.flagged ? "warning" : "default"}>
              <Flag />
            </IconButton>
          </Box>
          
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                />
              ))}
            </RadioGroup>
          )}
          
          {currentQuestion.type === 'essay' && (
            <TextField
              fullWidth
              multiline
              rows={6}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              variant="outlined"
            />
          )}
          
          {currentQuestion.type === 'coding' && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="textSecondary">
                Write your code solution:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder={`function solution(input) {\n  // Your code here\n}`}
                variant="outlined"
                sx={{ fontFamily: 'monospace' }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => setShowSubmitDialog(true)}
          disabled={submitting}
        >
          Submit Assessment
        </Button>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Save & Next
          </Button>
          
          {currentQuestionIndex === questions.length - 1 && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitting}
            >
              Final Submit
            </Button>
          )}
        </Box>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Assessment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your assessment? 
            {Object.keys(answers).length < questions.length && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You have {questions.length - Object.keys(answers).length} unanswered questions.
              </Alert>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Confirm Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentRoom;