/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Truck,
  CreditCard,
  ArrowLeft,
  Package,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Q5qtpEAnvAOEf8E7Udi625h2tNVMeUM6dvV2RNb2XZ7pZQ990rJexYN8OTefbtrhb1BhqYJ02GYzdi0izusWFZM00oQkEulaJ",
);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        className="w-full mt-4 text-white"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </span>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};

const statusStyles = {
  delivered: {
    true: "bg-teal-50 text-teal-700 border-teal-200",
    false: "bg-amber-50 text-amber-700 border-amber-200",
  },
  paid: {
    true: "bg-teal-50 text-teal-700 border-teal-200",
    false: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [clientSecret, setClientSecret] = useState("");

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      return data;
    },
  });

  const { mutate: deliverOrder, isLoading: isDeliverLoading } = useMutation({
    mutationKey: ["deliverOrder"],
    mutationFn: async ({ orderId }) => {
      const { data } = await axios.put(`/api/orders/${orderId}/deliver`);
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Order delivered!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (order && !order.isPaid) {
      const createPaymentIntent = async () => {
        try {
          const { data } = await axios.put(`/api/orders/${orderId}/pay`);
          setClientSecret(data.clientSecret);
        } catch (err) {
          toast.error("Failed to initialize payment. Please try again.");
        }
      };
      createPaymentIntent();
    }
  }, [order, orderId]);

  const handlePaymentSuccess = async () => {
    await refetch();
    toast.success("Payment successful! Your order has been paid.");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-gray-400 mb-4" />
        <span className="text-xl font-semibold text-gray-600">
          Loading order details...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <FaExclamationTriangle className="text-6xl text-gray-400 mb-4" />
        <span className="text-2xl font-bold text-gray-700 mb-2">
          Oops! Something went wrong.
        </span>
        <p className="text-gray-500 mb-4">
          We couldn't fetch the order details. Please try again later.
        </p>
        <Link
          to="/placeorder"
          className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
        >
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl bg-gray-50 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to="/placeorder"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold mb-8 text-lg"
      >
        <ArrowLeft className="mr-2" size={24} /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Order #{order._id}
        </h1>
        <Badge
          className={`text-sm py-1 px-3 border ${
            statusStyles.paid[order.isPaid]
          }`}
        >
          {order.isPaid ? "Paid" : "Unpaid"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Order details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center text-xl text-gray-800">
                <Truck className="mr-2" size={24} /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{userInfo.name}</p>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Delivery Status:</p>
                <Badge
                  className={`text-xs py-1 px-2 border ${
                    statusStyles.delivered[order.isDelivered]
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center text-xl text-gray-800">
                <CreditCard className="mr-2" size={24} /> Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Method:</p>
                <p className="font-medium">Stripe</p>
              </div>
              <Separator className="bg-gray-100" />
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Payment Status:</p>
                <Badge
                  className={`text-xs py-1 px-2 border ${
                    statusStyles.paid[order.isPaid]
                  }`}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center text-xl text-gray-800">
                <ShoppingCart className="mr-2" size={24} /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {order.orderItems.length === 0 ? (
                <p className="p-6 text-center text-gray-500">
                  Your order is empty
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {order.orderItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className="p-6 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={`/assets${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <Link
                            to={`/products/${item._id}`}
                            className="text-lg font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-500">
                            {item.qty} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">
                        ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Order summary and payment */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white shadow-sm sticky top-8">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl flex items-center text-gray-800">
                <DollarSign className="mr-2" size={20} /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Items:</p>
                  <p className="font-medium">${order.itemsPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Shipping:</p>
                  <p className="font-medium">
                    ${order.shippingPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Tax:</p>
                  <p className="font-medium">${order.taxPrice.toFixed(2)}</p>
                </div>
                <Separator className="bg-gray-100" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <p>Total:</p>
                  <p>${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {!order.isPaid && clientSecret && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-center text-gray-800">
                        Pay with Stripe
                      </CardTitle>
                      <CardDescription className="text-center text-gray-500">
                        Safe and secure payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Elements stripe={stripePromise} options={stripeOptions}>
                        <CheckoutForm
                          orderId={orderId}
                          onSuccess={handlePaymentSuccess}
                        />
                      </Elements>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-center text-gray-800">
                        Mark as Delivered
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => deliverOrder({ orderId: order._id })}
                        disabled={isDeliverLoading}
                      >
                        {isDeliverLoading ? (
                          <>
                            <FaSpinner
                              className="animate-spin mr-2"
                              size={18}
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Package className="mr-2" size={18} />
                            Mark Order as Delivered
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderPage;
