import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { payService } from '../../lib/payService';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Star,
  Support,
  School,
  TrendingUp,
  Security,
} from '@mui/icons-material';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'For beginners who want to try basic features',
      features: [
        { included: true, text: '5 assessments per month' },
        { included: true, text: 'Basic AI feedback' },
        { included: true, text: 'Community support' },
        { included: false, text: 'Advanced analytics' },
        { included: false, text: 'Priority support' },
        { included: false, text: 'Certification' },
      ],
      color: 'default' as const,
    },
    {
      name: 'Pro',
      price: { monthly: 29, yearly: 290 },
      description: 'For serious learners and professionals',
      features: [
        { included: true, text: 'Unlimited assessments' },
        { included: true, text: 'Advanced AI feedback' },
        { included: true, text: 'Detailed analytics' },
        { included: true, text: 'Priority support' },
        { included: true, text: 'Skill certification' },
        { included: false, text: 'Team features' },
      ],
      color: 'primary' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      description: 'For teams and educational institutions',
      features: [
        { included: true, text: 'Everything in Pro' },
        { included: true, text: 'Team management' },
        { included: true, text: 'Custom assessments' },
        { included: true, text: 'API access' },
        { included: true, text: 'Dedicated support' },
        { included: true, text: 'White labeling' },
      ],
      color: 'secondary' as const,
    },
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.name === 'Free') {
      navigate('/register');
      return;
    }

    setProcessing(true);
    try {
      const paymentData = {
        amount: plan.price[billingCycle],
        email: 'user@example.com', // In practice, this comes from the user
        firstName: 'Test',
        lastName: 'User',
        returnUrl: `${window.location.origin}/payment-success`,
      };

      const response = await payService.initiatePayment(paymentData);
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateSavings = (plan: typeof plans[0]) => {
    if (plan.price.yearly === 0) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    return Math.round(((monthlyTotal - plan.price.yearly) / monthlyTotal) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
        Select the perfect plan for your learning journey
      </Typography>

      {/* Billing Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
        <Typography>Monthly</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={billingCycle === 'yearly'}
              onChange={(e) => setBillingCycle(e.target.checked ? 'yearly' : 'monthly')}
              color="primary"
            />
          }
          label=""
        />
        <Box>
          <Typography>Yearly</Typography>
          <Typography variant="caption" color="success.main">
            Save up to 20%
          </Typography>
        </Box>
      </Box>

      {/* Plans */}
      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                border: plan.popular ? '2px solid' : '1px solid',
                borderColor: plan.popular ? 'primary.main' : 'divider',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                zIndex: plan.popular ? 1 : 0,
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  <Star sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  MOST POPULAR
                </Box>
              )}

              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3">
                    ${plan.price[billingCycle]}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </Typography>
                </Box>

                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Save {calculateSavings(plan)}% compared to monthly
                  </Alert>
                )}

                <Typography color="textSecondary" paragraph>
                  {plan.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {feature.included ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          color: feature.included ? 'textPrimary' : 'textDisabled',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  color={plan.color}
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Comparison */}
      <Paper sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Platform Features
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI-Powered Learning
              </Typography>
              <Typography color="textSecondary">
                Personalized assessments and feedback powered by advanced AI
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Progress Tracking
              </Typography>
              <Typography color="textSecondary">
                Detailed analytics and progress reports
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Exam Integrity
              </Typography>
              <Typography color="textSecondary">
                Advanced proctoring and security features
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* FAQ */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Can I cancel my subscription?
            </Typography>
            <Typography color="textSecondary">
              Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Is there a free trial?
            </Typography>
            <Typography color="textSecondary">
              Yes, all paid plans come with a 14-day free trial. No credit card required for the trial.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              What payment methods do you accept?
            </Typography>
            <Typography color="textSecondary">
              We accept credit/debit cards, mobile money, and bank transfers through our secure payment gateway.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Can I switch plans?
            </Typography>
            <Typography color="textSecondary">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Still have questions?
        </Typography>
        <Typography color="textSecondary" paragraph>
          Contact our sales team for personalized assistance
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Support />}
          onClick={() => navigate('/contact')}
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
};

export default Pricing;