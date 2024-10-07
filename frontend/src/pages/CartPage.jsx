import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart, removeFromCart, clearCart } from '@/store';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = totalItems === 0 ? 0 : subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleQtyChange = (item, change) => {
    const newQty = Math.max(1, Math.min(item.qty + change, item.countInStock));
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    showAlertWithMessage('Item removed from cart successfully.');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    showAlertWithMessage('Cart cleared successfully.');
  };

  const handleProceedToCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  const showAlertWithMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Shopping Cart
      </motion.h1>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert variant="success" className="mb-4">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">Your cart is empty.</p>
              <Link
                to="/"
                className="text-blue-600 hover:underline flex items-center justify-center"
              >
                <ArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-6 pb-6 border-b border-gray-200 last:border-b-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={`/assets${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg shadow-md object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQtyChange(item, -1)}
                          disabled={item.qty === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.qty}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQtyChange(item, 1)}
                          disabled={item.qty === item.countInStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button
                variant="destructive"
                className="mt-4"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </>
          )}
        </motion.div>

        <motion.div
          className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-300 h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button
            onClick={handleProceedToCheckout}
            className="w-full"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
