import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  RefreshCw,
  Download,
  CreditCard,
  History,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface PaymentPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  features: string[];
}

const ChapaPayment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [loading, setLoading] = useState(false);

  const paymentPlans: PaymentPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 50,
      price: 500,
      features: ['50 AI Simulations', 'Up to 10 candidates', 'Email support'],
    },
    {
      id: 'pro',
      name: 'Professional',
      credits: 150,
      price: 1200,
      popular: true,
      features: ['150 AI Simulations', 'Up to 50 candidates', 'Priority support', 'AI Proctoring'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 500,
      price: 3500,
      features: ['500 AI Simulations', 'Unlimited candidates', 'API Access', 'Dedicated Manager'],
    },
  ];

  const selectedPlanData = paymentPlans.find(plan => plan.id === selectedPlan);

  const handlePayment = async () => {
    if (!selectedPlanData) return;
    setLoading(true);

    try {
      // Logic: Call your Backend API here
      // The backend will communicate with Chapa and return a checkout_url
      /*
      const response = await api.post('/payments/initialize', { planId: selectedPlan });
      if (response.data.checkout_url) {
         window.location.href = response.data.checkout_url;
      }
      */
      
      // Temporary Mock for UI demonstration
      setTimeout(() => {
        console.log("Redirecting to Chapa...");
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Payment initialization failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Credits</h2>
          <p className="text-slate-500 text-sm">Manage your account balance and subscriptions</p>
        </div>
        <Badge variant="outline" className="gap-2 bg-green-50 text-green-700 border-green-200 py-1.5 px-3">
          <Shield className="h-4 w-4" />
          Secured by Chapa
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="buy" className="rounded-lg px-8">Buy Credits</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-8">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-8 animate-in fade-in duration-500">
          {/* Current Balance Overview */}
          <Card className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white border-none shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Available Balance</p>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <h3 className="text-5xl font-extrabold text-white tracking-tight">150</h3>
                    <span className="text-blue-200 text-xl font-medium">Credits</span>
                  </div>
                </div>
                <div className="w-full md:w-72 space-y-3 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100 font-medium">Usage Limit</span>
                    <span className="font-bold">65% Used</span>
                  </div>
                  <Progress value={65} className="h-2 bg-white/20" />
                  <p className="text-xs text-blue-200 text-center">Your credits will expire in 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
                  selectedPlan === plan.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 font-semibold text-sm uppercase">ETB</span>
                  </div>
                  <CardDescription className="font-semibold text-blue-600 mt-1">{plan.credits} Credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator className="bg-slate-200" />
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Checkout Summary & Action */}
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 uppercase text-xs tracking-widest">
                <Zap className="h-4 w-4 text-amber-500" />
                Order Summary
              </div>
              <div className="flex items-center gap-4 opacity-70">
                <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <CardContent className="p-8 space-y-6">
              {selectedPlanData && (
                <div className="flex flex-col md:flex-row justify-between gap-12">
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-bold text-slate-900">{selectedPlanData.name} Subscription</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      You are adding {selectedPlanData.credits} credits to your account. 
                      Credits allow you to run full AI-powered technical simulations and candidate assessments.
                    </p>
                  </div>
                  <div className="w-full md:w-96 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Package Price</span>
                      <span className="font-bold">{selectedPlanData.price} ETB</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Processing Fee</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-2xl font-black text-slate-900">
                      <span>Total</span>
                      <span>{selectedPlanData.price} ETB</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 pt-4">
                <Button 
                  className="w-full py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                  ) : (
                    <Lock className="mr-3 h-5 w-5" />
                  )}
                  {loading ? "Initializing..." : "Proceed to Secure Payment"}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> SSL Encrypted</span>
                  <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> No data stored</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Chapa Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription>Download invoices for your records</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="font-semibold">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-50 p-3 rounded-full">
                        <History className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Professional Credits Bundle</p>
                        <p className="text-xs text-slate-400 font-medium">Order ID: CH-74523 • Aug 12, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-slate-900">1,200 ETB</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Paid via Telebirr</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-none font-bold text-[10px] uppercase px-3 py-1">Success</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChapaPayment;