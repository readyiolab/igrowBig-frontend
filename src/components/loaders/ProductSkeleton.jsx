import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ProductSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="h-full flex flex-col">
            <CardContent className="p-2 flex flex-col h-full space-y-4">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-10 w-full mt-auto rounded-md" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ProductSkeleton;