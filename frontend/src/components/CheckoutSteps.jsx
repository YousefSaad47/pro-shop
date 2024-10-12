import React from 'react';
import { User, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const CheckoutSteps = ({ currentStep }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Sign In', icon: User, route: '/login' },
    { number: 2, title: 'Shipping', icon: Truck, route: '/shipping' },
    { number: 3, title: 'Payment', icon: CreditCard, route: '/payment' },
    {
      number: 4,
      title: 'Place Order',
      icon: CheckCircle,
      route: '/placeorder',
    },
  ];

  const handleStepClick = (step) => {
    if (step.number === 1 && userInfo) {
      toast({
        title: 'Already Signed In',
        description: 'You are already logged into your account.',
        duration: 3000,
        className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
      });
    } else {
      navigate(step.route);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <motion.div
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStepClick(step)}
            >
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer
                  ${
                    step.number <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }
                  ${step.number === currentStep ? 'ring-4 ring-blue-300' : ''}
                  transition-all duration-300 ease-in-out hover:shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <step.icon size={24} />
              </motion.div>
              <motion.p
                className={`mt-4 text-sm font-semibold
                  ${
                    step.number <= currentStep
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {step.title}
              </motion.p>
            </motion.div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 relative">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{
                    width: step.number < currentStep ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <Toaster />
    </div>
  );
};

export default CheckoutSteps;
