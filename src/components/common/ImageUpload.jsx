export const ImageUpload = ({ 
  label,
  onUpload,
  imagePreview,
  existingImageUrl,
  disabled = false,
  maxSize = "4MB",
  dimensions = "348x348"
}) => {
  const handleImageError = (e) => {
    e.target.src = "/placeholder-image.jpg";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || `Image (Max ${maxSize}, ${dimensions} recommended)`}
      </label>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={onUpload}
        disabled={disabled}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
      />
      {(imagePreview || existingImageUrl) && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Preview:</p>
          <img
            src={imagePreview || existingImageUrl}
            alt="Preview"
            className="w-[348px] h-[348px] object-cover rounded-lg shadow-sm"
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
};
