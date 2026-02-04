import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiService } from '../../lib/aiService'; 
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  IconButton
} from '@mui/material';

// Using MUI v6 Grid2 as requested
import Grid from '@mui/material/Grid'; 

import {
  ExpandMore,
  CheckCircle,
  Cancel,
  TrendingUp,
  Download,
  Share,
  ArrowBack,
  Refresh
} from '@mui/icons-material';

// Interfaces
interface FeedbackDetail {
  questionId: string;
  isCorrect: boolean;
  feedback: string;
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // in seconds
  detailedFeedback: FeedbackDetail[]; 
}

const MyResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  // Helper: Format seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Check if result came through navigation state
      if (location.state?.result) {
        setResults([location.state.result]);
      } else {
        // 2. Fallback: Fetch from API if state is empty (e.g. on page refresh)
        const history = await aiService.getAssessmentHistory();
        if (history && history.length > 0) {
          setResults(history);
        } else {
          setResults([]); // No history found
        }
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleAccordionChange = (resultId: string) => {
    setExpandedResult(expandedResult === resultId ? null : resultId);
  };

  const downloadResult = (result: AssessmentResult) => {
    const data = {
      ...result,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPerformanceColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
        <Refresh className="animate-spin" color="primary" />
        <Typography color="textSecondary">Analyzing your results...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Navigation Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate('/dashboard')} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="800">Results</Typography>
        </Stack>
        <Button variant="contained" onClick={() => navigate('/assessment/room')} startIcon={<TrendingUp />}>
          New Test
        </Button>
      </Stack>
      
      {results.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No assessment history found.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/assessment/room')}>
            Take your first assessment
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {results.map((result, index) => (
            <Grid size={12} key={index}>
              <Card variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
                    <Box>
                      <Typography variant="h5" fontWeight="700">Assessment Report</Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: #{(Math.random() * 10000).toFixed(0)} | Completed on {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button startIcon={<Download />} onClick={() => downloadResult(result)} variant="outlined" size="small">
                        Export
                      </Button>
                      <Button startIcon={<Share />} variant="outlined" size="small">
                        Share
                      </Button>
                    </Stack>
                  </Stack>
                  
                  <Divider sx={{ mb: 4 }} />
                  
                  {/* Performance Metrics */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        bgcolor: `${getPerformanceColor(result.score)}.light`, 
                        textAlign: 'center',
                        color: `${getPerformanceColor(result.score)}.dark`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h2" fontWeight="900">{result.score}%</Typography>
                        <Typography variant="subtitle1" fontWeight="600">Overall Score</Typography>
                        <Chip 
                          label={result.score >= 80 ? 'Master' : result.score >= 60 ? 'Competent' : 'Developing'} 
                          sx={{ mt: 1, fontWeight: 'bold' }}
                          color={getPerformanceColor(result.score)}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="textSecondary" textTransform="uppercase" fontWeight="700">Accuracy</Typography>
                          <Typography variant="h5" fontWeight="700" mb={1}>{result.correctAnswers} / {result.totalQuestions}</Typography>
                          <LinearProgress variant="determinate" value={(result.correctAnswers / result.totalQuestions) * 100} sx={{ height: 8, borderRadius: 4 }} />
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="textSecondary" textTransform="uppercase" fontWeight="700">Duration</Typography>
                          <Typography variant="h5" fontWeight="700" mb={1}>{formatDuration(result.timeTaken)}</Typography>
                          <LinearProgress variant="determinate" color="info" value={100} sx={{ height: 8, borderRadius: 4 }} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="textSecondary" textTransform="uppercase" fontWeight="700">Efficiency</Typography>
                          <Typography variant="h5" fontWeight="700" mb={1}>{Math.round(result.score)}%</Typography>
                          <LinearProgress variant="determinate" color="secondary" value={result.score} sx={{ height: 8, borderRadius: 4 }} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Detailed Feedback */}
                  <Accordion
                    expanded={expandedResult === `result-${index}`}
                    onChange={() => handleAccordionChange(`result-${index}`)}
                    elevation={0}
                    sx={{ border: '1px solid #f0f0f0', borderRadius: '12px !important' }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight="700">Question-by-Question Analysis</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <TableContainer>
                        <Table>
                          <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Feedback</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {result.detailedFeedback.map((feedback, idx) => (
                              <TableRow key={idx} hover>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                  {feedback.isCorrect ? (
                                    <Chip icon={<CheckCircle />} label="Correct" color="success" size="small" />
                                  ) : (
                                    <Chip icon={<Cancel />} label="Incorrect" color="error" size="small" />
                                  )}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                  {feedback.feedback}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyResults;