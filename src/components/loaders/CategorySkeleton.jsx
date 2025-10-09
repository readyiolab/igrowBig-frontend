import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const CategorySkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="flex flex-col items-center p-4">
              <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg mb-3" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default CategorySkeleton;