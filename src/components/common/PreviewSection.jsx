import React, { useState } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Additional styles for better preview rendering
const previewStyles = `
  .ql-editor ul,
  .ql-editor ol {
    padding-left: 2rem !important;
    margin: 1.25rem 0 !important;
  }
  
  .ql-editor li {
    margin-bottom: 0.5rem !important;
    line-height: 1.75 !important;
  }
  
  .ql-editor p {
    margin-bottom: 1rem !important;
    line-height: 1.75 !important;
  }
  
  .ql-editor ul {
    list-style-type: disc !important;
  }
  
  .ql-editor ol {
    list-style-type: decimal !important;
  }
  
  .ql-editor strong {
    font-weight: 700 !important;
  }
  
  .ql-editor em {
    font-style: italic !important;
  }
  
  .ql-editor u {
    text-decoration: underline !important;
  }
`;

// ============ Enhanced PreviewSection Component ============
export const PreviewSection = ({ title, content, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 p-8 bg-white overflow-auto' : ''}`}>
      <style>{previewStyles}</style>
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-lg">
        {/* Preview Header */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-5 py-3.5 border-b-2 border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">Live Preview</h4>
              <p className="text-xs text-gray-600">See your changes in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-600 hover:text-gray-900 transition-all p-2 hover:bg-white/70 rounded-lg"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-900 transition-all p-2 hover:bg-white/70 rounded-lg"
              aria-label={isExpanded ? "Collapse preview" : "Expand preview"}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        {isExpanded && (
          <div className="p-8 bg-white">
            {/* Title Preview */}
            {title && (
              <div className="mb-6 pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                    Title
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 break-words leading-tight">
                  {title || <span className="text-gray-400 italic">No title provided</span>}
                </h1>
              </div>
            )}

            {/* Content Preview with Proper HTML Rendering */}
            {content && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-1 rounded">
                    Content
                  </span>
                </div>
                <div 
                  className="ql-editor prose prose-lg max-w-none text-gray-800 leading-relaxed
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
                    prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
                    prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-5
                    prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4
                    prose-h5:text-base prose-h5:mb-2 prose-h5:mt-3
                    prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-3
                    prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-base
                    prose-a:text-blue-600 prose-a:underline prose-a:font-medium hover:prose-a:text-blue-800 prose-a:transition-colors
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-em:text-gray-700 prose-em:italic
                    prose-ul:list-disc prose-ul:pl-8 prose-ul:my-5 prose-ul:space-y-2
                    prose-ol:list-decimal prose-ol:pl-8 prose-ol:my-5 prose-ol:space-y-2
                    prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-base prose-li:mb-2
                    prose-li:marker:text-blue-600 prose-li:marker:font-bold
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 
                    prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 
                    prose-blockquote:py-2 prose-blockquote:my-4 prose-blockquote:rounded-r
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded 
                    prose-code:text-sm prose-code:text-pink-600 prose-code:font-mono prose-code:font-semibold
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg 
                    prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700 prose-pre:my-4
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6 prose-img:border prose-img:border-gray-200
                    prose-hr:border-gray-300 prose-hr:my-8 prose-hr:border-t-2
                    prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-table:shadow-sm
                    prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 
                    prose-th:text-left prose-th:font-bold prose-th:text-gray-900
                    prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:text-gray-700
                    prose-thead:bg-gray-50
                    prose-video:rounded-lg prose-video:shadow-lg prose-video:my-6
                    [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-5 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:my-5 [&_ol]:space-y-2
                    [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:text-base [&_li]:mb-2
                    [&_p]:mb-4 [&_p]:leading-relaxed"
                  style={{
                    padding: 0
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: content || '<p class="text-gray-400 italic text-center py-8">No content provided yet. Start typing to see your preview!</p>' 
                  }}
                />
              </div>
            )}

            {/* Media Preview (Images/Videos) */}
            {children && (
              <div className="border-t-2 border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded">
                    Media
                  </span>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  {children}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ Enhanced RichTextEditor Component ============
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ direction: "rtl" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "script", "align", "direction",
  "list", "bullet", "indent",
  "blockquote", "code-block",
  "link", "image", "video"
];

export const RichTextEditor = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  id 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label} 
        {required && <span className="text-red-500 ml-1 text-base">*</span>}
      </label>
      
      {/* Helper Text */}
      <p className="text-xs text-gray-500 mb-2">
        Use the toolbar to format your text. Lists, headings, bold, italic, and more are supported.
      </p>

      <div className={`transition-all duration-200 rounded-lg ${
        isFocused 
          ? 'ring-2 ring-blue-500 shadow-lg' 
          : 'ring-1 ring-gray-300 shadow-sm'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <ReactQuill
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          className="bg-white rounded-lg overflow-hidden"
          placeholder={placeholder || "Start typing your content here..."}
          readOnly={disabled}
          aria-required={required}
          theme="snow"
          style={{
            minHeight: '200px'
          }}
        />
      </div>

      {/* Character Count (optional) */}
      {value && (
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
          <span>
            {value.replace(/<[^>]*>/g, '').length} characters
          </span>
          <span className="text-green-600 font-medium">
            ✓ Content will render with full formatting
          </span>
        </div>
      )}
    </div>
  );
};