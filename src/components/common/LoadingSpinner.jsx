// ============ LoadingSpinner.jsx ============
import React from "react";

export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="text-center py-6">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
    <span className="text-gray-500 text-lg mt-2 block animate-pulse">{message}</span>
  </div>
);