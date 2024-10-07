import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { clearCart } from '@/store';
import CheckoutSteps from '@/components/CheckoutSteps';
import { toast } from 'react-toastify';
import axios from 'axios';
import { addDecimals } from '@/utils/cartUtils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Truck, CreditCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const itemsPrice = Number(
    addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
  );
  const shippingPrice = Number(addDecimals(itemsPrice > 100 ? 0 : 10));
  const taxPrice = Number(addDecimals((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const { mutateAsync: placeOrder, isLoading } = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await axios.post('/api/orders', orderData);
      return data;
    },
    onSuccess: (data) => {
      toast.success('Order placed successfully!');
      const successSound = new Audio('/assets/sounds/success.mp3');
      successSound.play();
      dispatch(clearCart());
      navigate(`/orders/${data._id}`);
    },
    onError: () => {
      toast.error('Order placement failed. Please try again.');
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, shippingAddress.address, navigate]);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    } catch (err) {
      toast.error(err?.message || 'An error occurred while placing the order.');
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CheckoutSteps currentStep={4} />
      <h1 className="text-3xl font-bold text-center mb-8">Place Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2" size={20} /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="mr-2" size={20} /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p>{paymentMethod}</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2" size={20} /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className="py-4 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <img
                          src={`/assets${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <Link
                            to={`/products/${item._id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {item.qty} x ${item.price}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="sticky top-4">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-lg">
                <ShoppingCart className="mr-2" size={20} /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>${itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${taxPrice}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || isLoading}
                className="w-full py-3 text-lg"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlaceOrderPage;
