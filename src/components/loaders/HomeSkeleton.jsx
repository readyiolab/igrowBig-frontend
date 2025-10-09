import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Banner Skeleton */}
        <Skeleton className="h-72 sm:h-96 md:h-[500px] lg:h-[600px] w-full rounded-xl mb-16" />
        
        {/* Welcome Section Skeleton */}
        <div className="text-center mb-20">
          <Skeleton className="h-10 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-24 w-full max-w-4xl mx-auto mb-8" />
          <Skeleton className="h-14 w-48 mx-auto rounded-lg" />
        </div>
        
        {/* Introduction Section Skeleton */}
        <div className="mb-20">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <div className="w-32 h-1 bg-gray-200 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-40 rounded-lg mt-4" />
            </div>
            <Skeleton className="h-72 sm:h-96 md:h-[500px] lg:h-[400px] rounded-xl" />
          </div>
        </div>
        
        {/* About Section Skeleton */}
        <div className="mb-20">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <div className="w-32 h-1 bg-gray-200 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-2 md:order-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-40 rounded-lg mt-4" />
            </div>
            <Skeleton className="h-72 sm:h-96 md:h-[500px] lg:h-[400px] rounded-xl order-1 md:order-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;