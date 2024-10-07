import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, AlertCircle, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const OrderListPage = () => {
  let {
    isLoading,
    error,
    data: orders,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get('/api/orders');
      return data;
    },
  });

  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'USER', 'DATE', 'TOTAL', 'PAID', 'DELIVERED', ''].map(
            (header) => (
              <TableHead key={header}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(7)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <TableSkeleton />
            </div>
          </div>
        </div>
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
            An error occurred while fetching orders: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    ID
                  </TableHead>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    USER
                  </TableHead>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    DATE
                  </TableHead>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    TOTAL
                  </TableHead>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    PAID
                  </TableHead>
                  <TableHead className="font-bold sticky top-0 bg-white">
                    DELIVERED
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .slice()
                  .reverse()
                  .map((order) => (
                    <TableRow key={order._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        {order.user?.name || (
                          <span className="flex items-center text-gray-500">
                            <UserX className="h-4 w-4 mr-1" />
                            User unavailable
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {order.status === 'paid' ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : (
                          <XCircle className="text-red-500 h-5 w-5" />
                        )}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : (
                          <XCircle className="text-red-500 h-5 w-5" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
