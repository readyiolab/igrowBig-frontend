import { useState } from 'react';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const useImageValidation = (maxSize = MAX_FILE_SIZE, allowedTypes = ALLOWED_IMAGE_TYPES) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const validateImage = (file) => {
    if (!file) return { isValid: true };
    
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        message: `Image size exceeds ${maxSize / (1024 * 1024)}MB limit.` 
      };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        message: `Please upload a ${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} image.` 
      };
    }
    
    return { isValid: true };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImage(file);
      
      if (validation.isValid) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        return { success: true, message: 'Image selected!' };
      } else {
        return { success: false, message: validation.message };
      }
    }
    return { success: false, message: 'No file selected' };
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    return 'Image removed!';
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const setExistingImage = (url) => {
    setExistingImageUrl(url);
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
  };

  return {
    image,
    imagePreview,
    existingImageUrl,
    validateImage,
    handleImageUpload,
    handleImageRemove,
    resetImage,
    setExistingImage,
    handleImageError,
    maxFileSize: maxSize,
    allowedImageTypes: allowedTypes,
  };
};