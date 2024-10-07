import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '@/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

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
      className="absolute inset-0 bg-green-50/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center"
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl flex items-center space-x-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <span className="font-medium text-gray-700">
          Profile updated successfully!
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { toast } = useToast();

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
          error.response?.data?.message || 'Could not update profile',
        variant: 'destructive',
      });
      const updateUserSound = new Audio('/assets/sounds/error.mp3');
      updateUserSound.play();
    },
  });

  const { data: myOrders, isLoading: isMyOrdersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders/myorders');
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
      });
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
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Delivered
        </span>
      );
    }
    if (isPaid) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          Paid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
        Pending
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-8"
      >
        <div className="lg:w-1/4">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarImage src={userInfo?.avatar || ''} alt={name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
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
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Admin</span>
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                    {name}
                    {userInfo?.isAdmin && (
                      <span className="text-sm text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm">{email}</p>
                </div>
                <div className="w-full pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors duration-200"
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

        <div className="lg:w-3/4">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="w-full justify-start border-b pb-px mb-4">
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
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Profile Information
                    </h2>
                    <Button
                      variant={isEditing ? 'outline' : 'default'}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2"
                    >
                      <UserCog className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
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
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                          <label className="text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                          <label className="text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Name
                          </label>
                          <p className="mt-1 text-lg font-medium text-gray-800">
                            {name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Email
                          </label>
                          <p className="mt-1 text-lg font-medium text-gray-800">
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
                    <Package className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Order History
                    </h2>
                  </div>
                </CardHeader>
                <CardContent>
                  {isMyOrdersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-y-auto max-h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-600">
                              Order ID
                            </TableHead>
                            <TableHead className="text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Date</span>
                              </div>
                            </TableHead>
                            <TableHead className="text-gray-600">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>Total</span>
                              </div>
                            </TableHead>
                            <TableHead className="text-gray-600">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myOrders
                            ?.slice()
                            .reverse()
                            .map((order) => (
                              <TableRow
                                key={order._id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium text-primary">
                                  {order._id}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-600 font-medium">
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
