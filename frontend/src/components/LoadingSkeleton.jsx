import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-24 rounded-full" />
      ))}
    </div>

    <div className="flex justify-end">
      <Skeleton className="h-10 w-80 rounded-full" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4 rounded-full" />
          <Skeleton className="h-5 w-1/2 rounded-full" />
          <Skeleton className="h-5 w-1/3 rounded-full" />
        </div>
      ))}
    </div>

    <div className="flex justify-center space-x-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-10 rounded-full" />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
