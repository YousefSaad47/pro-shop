import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const UserListPage = () => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users?page=${currentPage}`);
      return data;
    },
  });

  const { mutateAsync: deleteUser, isLoading: deleteUserLoading } = useMutation(
    {
      mutationKey: ['deleteUser'],
      mutationFn: async (userId) => {
        const { data } = await axios.delete(`/api/users/${userId}`);
        return data;
      },
      onSuccess: () => {
        refetch();
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
          duration: 3000,
        });
        const deleteUserSound = new Audio('/assets/sounds/success.mp3');
        deleteUserSound.play();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete user',
          variant: 'destructive',
          duration: 3000,
          className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
        });
        const deleteUserSound = new Audio('/assets/sounds/error.mp3');
        deleteUserSound.play();
      },
    }
  );

  const handleDeleteUser = async (userId) => {
    setIsDeleteDialogOpen(false);
    try {
      await deleteUser(userId);
    } catch (err) {
      toast({
        title: 'Error',
        description: "Can't delete an admin user",
        variant: 'destructive',
        duration: 3000,
        className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
      });
    }
  };

  const handleOpenDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'NAME', 'EMAIL', 'ADMIN', 'ACTIONS'].map((header) => (
            <TableHead key={header}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(7)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(5)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderPagination = () => {
    const totalPages = data?.totalPages || 1;
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={number === currentPage ? 'default' : 'outline'}
            onClick={() => setCurrentPage(number)}
            className={`w-8 h-8 p-0 ${
              number === currentPage ? 'bg-primary text-primary-foreground' : ''
            }`}
          >
            {number}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="w-8 h-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const pageNumber = parseInt(goToPage, 10);
            if (pageNumber >= 1 && pageNumber <= totalPages) {
              setCurrentPage(pageNumber);
              setGoToPage('');
            } else {
              toast({
                title: 'Invalid Page',
                description: `Please enter a page number between 1 and ${totalPages}`,
                variant: 'destructive',
                duration: 3000,
              });
            }
          }}
          className="flex items-center space-x-2"
        >
          <Input
            type="number"
            placeholder="Go to page"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            className="w-32 h-8 text-xs"
            min="1"
            max={totalPages}
          />
          <Button type="submit" variant="outline" className="h-8 text-xs">
            Go
          </Button>
        </form>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while fetching users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">NAME</TableHead>
              <TableHead className="font-bold">EMAIL</TableHead>
              <TableHead className="font-bold">ADMIN</TableHead>
              <TableHead className="font-bold">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/admin/user/${user._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleOpenDeleteConfirmation(user)}
                    >
                      {deleteUserLoading && userToDelete?._id === user._id ? (
                        <Skeleton className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}

      {userToDelete && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          className="bg-gray-200"
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the user "{userToDelete.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteUser(userToDelete._id)}
                disabled={deleteUserLoading}
              >
                {deleteUserLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UserListPage;
