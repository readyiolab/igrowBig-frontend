// ============ RichTextEditor.jsx ============
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ direction: "rtl" }],
    [{ list: "ordered" }, { list: "bullet" }],
  
    
   
    ["clean"],
  ],
};

export const RichTextEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  id 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <ReactQuill
      id={id}
      value={value}
      onChange={onChange}
      modules={QUILL_MODULES}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
      placeholder={placeholder}
      readOnly={disabled}
      aria-required={required}
    />
  </div>
);