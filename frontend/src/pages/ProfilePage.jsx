import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserCog,
  Mail,
  User,
  Lock,
  CheckCircle2,
  Package,
  Calendar,
  DollarSign,
  CreditCard,
  Truck,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 5;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState('');

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage('');
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center mt-4 space-x-2 space-y-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? 'default' : 'outline'}
          onClick={() => onPageChange(pageNum)}
          className={`w-8 h-8 p-0 ${
            currentPage === pageNum ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-2">
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Go to"
          className="text-xs w-16 h-8"
        />
        <Button
          variant="outline"
          onClick={handleGoToPage}
          disabled={
            !inputPage ||
            parseInt(inputPage, 10) < 1 ||
            parseInt(inputPage, 10) > totalPages
          }
          className="h-8 px-2 py-0 text-xs"
        >
          Go
        </Button>
      </div>
    </div>
  );
};

const SuccessOverlay = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-green-50/50 dark:bg-green-900/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center space-x-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
          Profile updated!
        </span>
      </motion.div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { mutateAsync: logoutApiCall } = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/users/logout');
      return res.data;
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  const handleLogout = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      dispatch(clearCart());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (body) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { data } = await axios.put('/api/users/profile', body);
      return data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      setShowSuccessOverlay(true);
      setIsEditing(false);
      const updateUserSound = new Audio('/assets/sounds/success.mp3');
      updateUserSound.play();
    },
    onError: (error) => {
      toast({
        title: '⚠️ Update Failed',
        description:
          error.response?.data?.message || 'Could not update user profile',
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
        duration: 3000,
      });
      const updateUserSound = new Audio('/assets/sounds/error.mp3');
      updateUserSound.play();
    },
  });

  const { data: ordersData, isLoading: isMyOrdersLoading } = useQuery({
    queryKey: ['myOrders', currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/orders/myorders?pageNumber=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: '⚠️ Password Mismatch',
        description: 'The passwords you entered do not match',
        variant: 'destructive',
        className: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
        duration: 3000,
      });
      const updateUserSound = new Audio('/assets/sounds/error.mp3');
      updateUserSound.play();
      return;
    }

    const updates = {
      _id: userInfo._id,
      name,
      email,
      ...(password && { password }),
    };

    await updateProfileMutation.mutateAsync(updates);
  };

  const getStatusBadge = (isPaid, isDelivered) => {
    if (isDelivered) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-xs font-medium">
          Delivered
        </span>
      );
    }
    if (isPaid) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-xs font-medium">
          Paid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full text-xs font-medium">
        Pending
      </span>
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-8"
      >
        <div className="lg:w-full lg:max-w-xs">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                    <AvatarImage src={userInfo?.avatar || ''} alt={name} />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {userInfo?.isAdmin && (
                    <div className="absolute -bottom-2 -right-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary border-none"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span className="text-xs font-medium">Admin</span>
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-center space-y-1.5">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
                    {name}
                    {userInfo?.isAdmin && (
                      <span className="text-sm text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {email}
                  </p>
                </div>
                <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign out</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:flex-1">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="w-full justify-start border-b pb-px mb-4 overflow-x-auto flex-nowrap">
              <TabsTrigger value="profile" className="relative">
                Profile Settings
              </TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="relative shadow-lg border-t-4 border-primary">
                <AnimatePresence>
                  {showSuccessOverlay && (
                    <SuccessOverlay
                      onComplete={() => {
                        setShowSuccessOverlay(false);
                        setPassword('');
                        setConfirmPassword('');
                      }}
                    />
                  )}
                </AnimatePresence>

                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Profile Information
                    </h2>
                    <Button
                      variant={isEditing ? 'outline' : 'default'}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2"
                    >
                      <UserCog className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10"
                              placeholder="Enter new password (optional)"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="pl-10"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isLoading}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                      >
                        {updateProfileMutation.isLoading
                          ? 'Updating...'
                          : 'Update Profile'}
                      </Button>
                    </motion.form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Name
                          </label>
                          <p className="mt-1 text-lg font-medium text-gray-800 dark:text-gray-200">
                            {name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </label>
                          <p className="mt-1 text-lg font-medium text-gray-800 dark:text-gray-200">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Order History
                    </h2>
                  </div>
                </CardHeader>
                <CardContent>
                  {isMyOrdersLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-gray-600 dark:text-gray-300">
                                Order ID
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Date</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>Total</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-300">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ordersData?.orders.map((order) => (
                              <TableRow
                                key={order._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <TableCell className="font-medium text-primary">
                                  {order._id.slice(-6)}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-300">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-300 font-medium">
                                  ${order.totalPrice.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(
                                      order.status === 'paid',
                                      order.isDelivered
                                    )}
                                    {order.status === 'paid' && (
                                      <CreditCard className="h-4 w-4 text-blue-500" />
                                    )}
                                    {order.isDelivered && (
                                      <Truck className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <Pagination
                        currentPage={ordersData?.page}
                        totalPages={ordersData?.pages}
                        onPageChange={handlePageChange}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
