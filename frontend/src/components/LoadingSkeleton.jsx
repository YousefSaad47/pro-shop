import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <Skeleton className="h-[80vh] w-full mb-24 rounded-3xl" />
    <Skeleton className="h-16 w-96 mb-12 mx-auto rounded-full" />
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
  </div>
);

export default LoadingSkeleton;
