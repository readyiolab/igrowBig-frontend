import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]" />

      {/* Breadcrumbs Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" />
          <span>/</span>
          <Skeleton className="h-4 w-24" />
          <span>/</span>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Product Gallery Skeleton */}
          <div className="lg:w-1/2">
            <Skeleton className="w-full h-64 sm:h-80 md:h-96 rounded-2xl" />
          </div>

          {/* Product Info Skeleton */}
          <div className="lg:w-1/2">
            <div className="p-6 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-24" />
              <div className="flex space-x-3">
                <Skeleton className="h-12 w-28 rounded-md" />
                <Skeleton className="h-12 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-6 border-t-2 p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;