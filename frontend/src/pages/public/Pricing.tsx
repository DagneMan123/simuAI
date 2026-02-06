import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
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
import Grid from '@mui/material/Grid'; // አዲሱ Grid2 ስህተቶችን ያስቀራል
import {
  CheckCircle,
  Cancel,
  Star,
  Support,
  School,
  TrendingUp,
  Security,
} from '@mui/icons-material';

// 1. የዳታ አይነቶችን (Types) በትክክል መወሰን (TypeScript ስህተት እንዳይኖር)
interface PlanFeature {
  included: boolean;
  text: string;
}

interface PricingPlan {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: PlanFeature[];
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  popular?: boolean;
}

// Mock payService - ይህን ከራስህ ፋይል ጋር ማገናኘት ትችላለህ
const payService = {
  initiatePayment: async (data: any) => {
    console.log("Payment Data:", data);
    return { checkoutUrl: "https://chapa.co/checkout-example" };
  }
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);

  const plans: PricingPlan[] = [
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
      color: 'inherit',
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
      color: 'primary',
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
      color: 'secondary',
    },
  ];

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.name === 'Free') {
      navigate('/register');
      return;
    }

    setProcessing(true);
    try {
      const paymentData = {
        amount: plan.price[billingCycle],
        email: 'user@example.com',
        firstName: 'Dagne',
        lastName: 'Software',
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

  const calculateSavings = (plan: PricingPlan) => {
    if (plan.price.yearly === 0) return 0;
    const monthlyTotal = plan.price.monthly * 12;
    return Math.round(((monthlyTotal - plan.price.yearly) / monthlyTotal) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 800 }}>
        Choose Your Plan
      </Typography>
      
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 6 }}>
        Select the perfect plan for your learning journey
      </Typography>

      {/* Billing Cycle Toggle Functionality */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
        <Typography sx={{ fontWeight: billingCycle === 'monthly' ? 'bold' : 'normal' }}>Monthly</Typography>
        <FormControlLabel
          sx={{ mx: 1 }}
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
          <Typography sx={{ fontWeight: billingCycle === 'yearly' ? 'bold' : 'normal' }}>Yearly</Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
            Save up to 20%
          </Typography>
        </Box>
      </Box>

      {/* Pricing Cards using Grid2 */}
      <Grid container spacing={4} alignItems="stretch">
        {plans.map((plan) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.popular ? '2px solid' : '1px solid',
                borderColor: plan.popular ? 'primary.main' : 'divider',
                boxShadow: plan.popular ? 10 : 1,
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 2,
                  }}
                >
                  <Star sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  MOST POPULAR
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {plan.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    ${plan.price[billingCycle]}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" sx={{ ml: 1 }}>
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </Typography>
                </Box>

                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <Alert severity="success" icon={false} sx={{ mb: 2, py: 0, fontWeight: 'bold' }}>
                    Save {calculateSavings(plan)}%
                  </Alert>
                )}

                <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {feature.included ? (
                          <CheckCircle fontSize="small" color="success" />
                        ) : (
                          <Cancel fontSize="small" color="disabled" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: feature.included ? 'textPrimary' : 'textDisabled',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? 'contained' : 'outlined'}
                  color={plan.color}
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Feature Highlights Section */}
      <Paper sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Platform Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            { icon: <School />, title: 'AI Learning', desc: 'Personalized feedback powered by AI.' },
            { icon: <TrendingUp />, title: 'Progress', desc: 'Detailed analytics and reports.' },
            { icon: <Security />, title: 'Security', desc: 'Secure proctoring and integrity.' }
          ].map((feat, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i} sx={{ textAlign: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 1, '& svg': { fontSize: 40 } }}>
                {feat.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{feat.title}</Typography>
              <Typography color="textSecondary" variant="body2">{feat.desc}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            { q: "Can I cancel my subscription?", a: "Yes, you can cancel at any time. Your access will continue until the end of the period." },
            { q: "Is there a free trial?", a: "Yes, all paid plans come with a 14-day free trial. No credit card required." }
          ].map((faq, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{faq.q}</Typography>
              <Typography color="textSecondary" variant="body2">{faq.a}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Footer */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Still have questions?
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Support />}
          onClick={() => navigate('/contact')}
          sx={{ px: 4, py: 1.5 }}
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
};

export default Pricing;