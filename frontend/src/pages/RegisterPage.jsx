import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { setCredentials } from '@/store';
import FormContainer from '@/components/FormContainer';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync: register, isLoading } = useMutation({
    mutationKey: ['register'],
    mutationFn: async (data) => {
      try {
        const res = await axios.post('/api/users', data);
        return res.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  const { userInfo } = useSelector((state) => state.auth);
  const search = useLocation();
  const sp = new URLSearchParams(search.search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [redirect, userInfo, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await register({ name, email, password });
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <FormContainer>
      <motion.div
        className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Sign up
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full py-2 px-4 text-white font-bold rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Registering...' : 'Sign up'}
            </Button>
          </motion.div>
          <motion.div
            className="text-center text-sm mt-4"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-indigo-600 hover:underline"
            >
              Sign in here
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </FormContainer>
  );
};

export default RegisterPage;
