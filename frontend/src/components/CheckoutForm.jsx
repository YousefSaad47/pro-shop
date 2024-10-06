import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CheckoutForm = ({ orderId, totalPrice, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const { mutate: createPaymentIntent } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/stripe/create-payment-intent', {
        orderId,
      });
      return data;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      toast.error('Failed to initialize payment. Please try again.');
    },
  });

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'An error occurred during payment.');
      } else if (paymentIntent.status === 'succeeded') {
        await axios.post('/api/stripe/payment-success', {
          orderId,
          paymentIntentId: paymentIntent.id,
        });
        toast.success('Payment successful!');
        onPaymentSuccess();
      }
    } catch (err) {
      toast.error('An error occurred during payment processing.');
    }

    setIsLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center p-4">
        <FaSpinner className="animate-spin text-3xl text-gray-400 mr-3" />
        <span className="text-lg font-medium text-gray-600">
          Initializing payment...
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        className="w-full mt-4"
        disabled={isLoading || !stripe || !elements}
        type="submit"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${totalPrice.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
