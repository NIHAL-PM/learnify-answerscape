
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2Icon, CheckCircle2Icon, XCircleIcon, Crown, Sparkles, Zap, Infinity, Shield } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PremiumUpgradeProps {
  onClose?: () => void;
}

const PremiumUpgrade = ({ onClose }: PremiumUpgradeProps = {}) => {
  const { user, upgradeUserToPremium } = useAppStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  const handleUpgrade = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to upgrade.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    setIsProcessing(true);
    
    if (isRazorpayLoaded) {
      // Create a new Razorpay instance
      const options = {
        key: 'rzp_test_lTcXyVVQB3TJHc', // Replace with your actual Razorpay test key
        amount: 999 * 100, // Amount in paise (999 INR)
        currency: 'INR',
        name: 'EasyPSC',
        description: 'Premium Subscription',
        image: '/logo.png',
        handler: function(response: any) {
          // Handle successful payment
          if (response.razorpay_payment_id) {
            upgradeUserToPremium(user.id);
            
            toast({
              title: "Upgrade Successful!",
              description: "You now have access to premium features.",
            });
            
            if (onClose) {
              onClose();
            } else {
              navigate('/');
            }
          }
          setIsProcessing(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#6366f1', // Indigo color
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You can upgrade to premium anytime.",
              variant: "default"
            });
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback if Razorpay is not loaded
      // Simulate payment processing
      setTimeout(() => {
        upgradeUserToPremium(user.id);
        
        setIsProcessing(false);
        
        toast({
          title: "Upgrade Successful!",
          description: "You now have access to premium features.",
        });
        
        if (onClose) {
          onClose();
        } else {
          navigate('/');
        }
      }, 2000);
    }
  };
  
  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-12 px-4 max-w-md relative"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-[30vw] h-[30vw] bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl hero-blob" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute bottom-20 left-10 w-[25vw] h-[25vw] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl hero-blob"></div>
      </div>
      
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Upgrade to Premium
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Unlock unlimited access to all features and content.
          </p>
          
          <div className="space-y-4">
            {/* Pricing Card */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300">Premium Plan</h3>
                <Badge className="font-medium bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0">Most Popular</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Unlimited questions, detailed analytics, and priority support.
              </p>
              <div className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">₹999/month</div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400 mt-4">
                <li className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-indigo-500" />
                  <span>Unlimited question generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span>Detailed performance analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all rounded-lg shadow-md hover:shadow-xl text-white" 
                onClick={handleUpgrade}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </>
                )}
              </Button>
            </div>
            
            {/* Confirmation/Error Message */}
            {isProcessing && (
              <div className="text-center text-muted-foreground">
                <Loader2Icon className="inline-block mr-2 h-5 w-5 animate-spin" />
                Processing your upgrade...
              </div>
            )}
            
            {user && user.isPremium && (
              <div className="text-center text-emerald-500 dark:text-emerald-400">
                <CheckCircle2Icon className="inline-block mr-2 h-5 w-5" />
                You are already a premium member!
              </div>
            )}
            
            {/* Back Button */}
            <Button 
              variant="outline" 
              className="w-full border-slate-200 dark:border-slate-700" 
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PremiumUpgrade;
