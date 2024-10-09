import React, { useState, useEffect } from 'react';
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
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  UserX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 10;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState('');

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
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
    <div className="flex justify-center items-center mt-4 space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
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
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center ml-4 space-x-2">
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Go to page"
          className="text-xs w-32 h-8"
        />
        <Button
          variant="outline"
          onClick={handleGoToPage}
          disabled={
            !inputPage ||
            parseInt(inputPage, 10) < 1 ||
            parseInt(inputPage, 10) > totalPages
          }
        >
          Go
        </Button>
      </div>
    </div>
  );
};

const OrderListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    error,
    data: ordersData,
  } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/orders?pageNumber=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      return data;
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="rounded-md border">
          <TableSkeleton />
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">USER</TableHead>
              <TableHead className="font-bold">DATE</TableHead>
              <TableHead className="font-bold">TOTAL</TableHead>
              <TableHead className="font-bold">PAID</TableHead>
              <TableHead className="font-bold">DELIVERED</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.orders.map((order) => (
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
      <Pagination
        currentPage={ordersData.page}
        totalPages={ordersData.pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrderListPage;
