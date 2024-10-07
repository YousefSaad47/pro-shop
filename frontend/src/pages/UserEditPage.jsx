import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormContainer from '@/components/FormContainer';
import {
  Loader2,
  UserCog,
  ArrowLeft,
  Shield,
  Mail,
  User,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center"
  >
    <motion.div
      className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="font-medium text-gray-700">Updating user...</span>
    </motion.div>
  </motion.div>
);

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
      className="absolute inset-0 bg-green-50/50 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center"
    >
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <span className="font-medium text-gray-700">Update successful!</span>
      </motion.div>
    </motion.div>
  );
};

const UserEditPage = () => {
  const { id: userId } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });

  const { data: loggedInUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/profile');
      return data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (body) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const { data } = await axios.put(`/api/users/${body._id}`, body);
      return data;
    },
    onSuccess: () => {
      refetch();
      setShowSuccessOverlay(true);
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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  useEffect(() => {
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, [loggedInUser]);

  const isCurrentUserAdmin = currentUser?.isAdmin;
  const isEditingSelf = currentUser?._id === userId;

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
      _id: userId,
      name,
      email,
    };

    if (isCurrentUserAdmin) {
      updates.isAdmin = isEditingSelf ? true : isAdmin;
    }

    if (password) {
      updates.password = password;
    }

    await updateUserMutation.mutateAsync(updates);
  };

  const getFieldDisabledState = (fieldName) => {
    if (isEditingSelf && isCurrentUserAdmin) {
      return fieldName === 'isAdmin';
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <FormContainer>
      <div className="px-4 md:px-20 lg:px-72">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative p-5 md:p-10 mt-5 mb-10 shadow-lg border-t-4 border-primary">
            <AnimatePresence>
              {updateUserMutation.isLoading && <LoadingOverlay />}
              {showSuccessOverlay && (
                <SuccessOverlay
                  onComplete={() => {
                    setShowSuccessOverlay(false);
                    navigate('/admin/userlist');
                  }}
                />
              )}
            </AnimatePresence>

            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <UserCog className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Edit User Profile
                  </h1>
                </div>
                <Link to="/admin/userlist">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isError ? (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {isEditingSelf && isCurrentUserAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Alert className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <AlertDescription className="text-blue-700">
                          You're editing your own admin account. Some
                          restrictions apply for security.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={getFieldDisabledState('name')}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={getFieldDisabledState('email')}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter new password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                      <Checkbox
                        id="isAdmin"
                        checked={isAdmin}
                        onCheckedChange={(checked) => setIsAdmin(checked)}
                        disabled={getFieldDisabledState('isAdmin')}
                      />
                      <label
                        htmlFor="isAdmin"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Administrator Privileges
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={updateUserMutation.isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  >
                    Update User Profile
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </FormContainer>
  );
};

export default UserEditPage;
