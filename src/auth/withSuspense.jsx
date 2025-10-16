import React, { Suspense } from "react";
import LoadingFallback from "@/components/common/LoadingFallback";

export const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);