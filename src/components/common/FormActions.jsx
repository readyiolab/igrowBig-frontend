// ============ FormActions.jsx ============
export const FormActions = ({ 
  onReset, 
  onSave, 
  isSubmitting, 
  disabled,
  isEditing 
}) => (
  <div className="flex justify-end gap-4 mt-8">
    <button
      onClick={onReset}
      disabled={isSubmitting}
      className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
      aria-label="Reset form"
    >
      Reset
    </button>
    <button
      onClick={onSave}
      disabled={isSubmitting || disabled}
      className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isEditing ? "Update" : "Save"}
    >
      {isSubmitting && (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
      )}
      {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
    </button>
  </div>
);