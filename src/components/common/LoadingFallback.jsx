import React from "react";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-700 font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingFallback;