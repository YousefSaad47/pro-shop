import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full p-4 relative"
      >
        <Skeleton className="w-full h-48 rounded-md" />
        <div className="flex flex-col flex-grow mt-2">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20 mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
