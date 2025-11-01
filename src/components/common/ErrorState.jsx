// ============ ErrorState.jsx ============
export const ErrorState = ({ 
  error, 
  onStartEditing, 
  onRetry,
  addButtonText = "Add Content" 
}) => (
  <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
    <svg
      className="mx-auto h-24 w-24 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Content</h3>
    <p className="text-gray-500 mb-6">
      {error?.message || "An error occurred while loading data. You can start adding content or try again."}
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={onStartEditing}
        className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
      >
        {addButtonText}
      </button>
      <button
        onClick={onRetry}
        className="border border-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);