import toast from "react-hot-toast";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES } from "./constants";

export const validateRequiredFields = (fields, fieldNames = {}) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!validateRequired(value, fieldNames[key] || key)) {
      return false;
    }
  }
  return true;
};

export const validateImage = (file) => {
  if (!file) return true;
  
  if (file.size > MAX_FILE_SIZE.IMAGE) {
    toast.error("Image size exceeds 4MB limit.");
    return false;
  }
  
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Please upload a JPEG, JPG, or PNG image.");
    return false;
  }
  
  return true;
};

export const validateVideo = (file) => {
  if (!file) return true;
  
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    toast.error("Please upload only MP4 files.");
    return false;
  }
  
  if (file.size > MAX_FILE_SIZE.VIDEO) {
    toast.error("File size exceeds 50MB limit.");
    return false;
  }
  
  return true;
};

export const validateYoutubeLink = (url) => {
  if (!url) return true;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (!match || match[2].length !== 11) {
    toast.error("Invalid YouTube URL. Please provide a valid link.");
    return false;
  }
  
  return true;
};

export const validateRequired = (value, fieldName) => {
  const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
  if (!trimmedValue || trimmedValue === "<p><br></p>") {
    toast.error(`${fieldName} is required.`);
    return false;
  }
  
  return true;
};