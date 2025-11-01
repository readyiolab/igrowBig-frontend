// ============ TextInput.jsx ============
export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  id,
  type = "text",
  className = ""
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50 ${className}`}
      placeholder={placeholder}
      disabled={disabled}
      aria-required={required}
    />
  </div>
);