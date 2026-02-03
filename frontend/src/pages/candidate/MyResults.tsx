import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { aiService, AssessmentResult } from '../../services/aiService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
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
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  TrendingUp,
  Download,
  Share,
} from '@mui/icons-material';

const MyResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // ከመጡበት ምንጭ የውጤት ዳታ ማግኘት
      if (location.state?.result) {
        setResults([location.state.result]);
      } else {
        // በተግባር ከAPI ሁሉንም ውጤቶች ይጠቅማል
        const mockResults: AssessmentResult[] = [
          {
            score: 85,
            totalQuestions: 20,
            correctAnswers: 17,
            timeTaken: 2700,
            detailedFeedback: Array.from({ length: 20 }, (_, i) => ({
              questionId: `q${i + 1}`,
              isCorrect: i < 17,
              feedback: i < 17 
                ? 'Correct answer! Good understanding of the concept.' 
                : 'Incorrect. Review the topic again.',
            })),
          },
          {
            score: 72,
            totalQuestions: 15,
            correctAnswers: 11,
            timeTaken: 1800,
            detailedFeedback: Array.from({ length: 15 }, (_, i) => ({
              questionId: `q${i + 1}`,
              isCorrect: i < 11,
              feedback: i < 11 
                ? 'Well done!' 
                : 'Need more practice on this topic.',
            })),
          },
        ];
        setResults(mockResults);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (resultId: string) => {
    setExpandedResult(expandedResult === resultId ? null : resultId);
  };

  const downloadResult = (result: AssessmentResult) => {
    // PDF ወይም CSV ለማውረድ ኮድ
    const data = {
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      date: new Date().toLocaleDateString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-result-${Date.now()}.json`;
    a.click();
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading results...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Assessment Results
      </Typography>
      
      {results.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="textSecondary">
              No assessment results found. Complete an assessment to see your results.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {results.map((result, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">
                        Assessment #{results.length - index}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Completed on {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={2}>
                      <Button
                        startIcon={<Download />}
                        onClick={() => downloadResult(result)}
                        variant="outlined"
                      >
                        Download
                      </Button>
                      <Button
                        startIcon={<Share />}
                        variant="outlined"
                      >
                        Share
                      </Button>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Overall Score */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color={getPerformanceColor(result.score)}>
                            {result.score}%
                          </Typography>
                          <Typography color="textSecondary">Overall Score</Typography>
                          <Chip 
                            label={result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Improvement'} 
                            color={getPerformanceColor(result.score)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={9}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="h6">{result.correctAnswers}/{result.totalQuestions}</Typography>
                          <Typography variant="body2" color="textSecondary">Correct Answers</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(result.correctAnswers / result.totalQuestions) * 100}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography variant="h6">
                            {Math.floor(result.timeTaken / 60)}min
                          </Typography>
                          <Typography variant="body2" color="textSecondary">Time Taken</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={70} // ከተፈቀደው ጊዜ ጋር ሲነፃፀር
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography variant="h6">
                            {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">Accuracy</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(result.correctAnswers / result.totalQuestions) * 100}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Detailed Feedback Accordion */}
                  <Accordion
                    expanded={expandedResult === `result-${index}`}
                    onChange={() => handleAccordionChange(`result-${index}`)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>View Detailed Feedback</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Question</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Feedback</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {result.detailedFeedback.slice(0, 10).map((feedback, idx) => (
                              <TableRow key={feedback.questionId}>
                                <TableCell>Question {idx + 1}</TableCell>
                                <TableCell>
                                  {feedback.isCorrect ? (
                                    <Chip 
                                      icon={<CheckCircle />} 
                                      label="Correct" 
                                      color="success" 
                                      size="small"
                                    />
                                  ) : (
                                    <Chip 
                                      icon={<Cancel />} 
                                      label="Incorrect" 
                                      color="error" 
                                      size="small"
                                    />
                                  )}
                                </TableCell>
                                <TableCell>{feedback.feedback}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                  
                  {/* Recommendations */}
                  {result.score < 80 && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Recommendations for Improvement:
                      </Typography>
                      <Typography>
                        • Practice more questions on weak areas<br />
                        • Review the concepts you missed<br />
                        • Take another assessment in 3 days
                      </Typography>
                    </Box>
                  )}
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