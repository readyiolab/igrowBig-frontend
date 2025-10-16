import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const Fallback = ({ error, resetErrorBoundary }) => (
  <div className="p-6 text-center">
    <h1 className="text-2xl text-gray-900">Something went wrong</h1>
    <pre className="mt-2 text-gray-600">{error.message}</pre>
    <button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 bg-black text-white rounded">
      Try Again
    </button>
  </div>
);

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()}>
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;