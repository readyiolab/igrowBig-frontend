import { useState } from 'react';


const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4'];

export const useVideoValidation = (maxSize = MAX_VIDEO_SIZE, allowedTypes = ALLOWED_VIDEO_TYPES) => {
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState(null);

  const validateVideo = (file) => {
    if (!file) return true;
    
    if (file.type !== 'video/mp4') {
      toast.error('Please upload only MP4 files.');
      return false;
    }
    
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
      return false;
    }
    
    return true;
  };

  const validateYoutubeLink = (url) => {
    if (!url) return true;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (!match || match[2].length !== 11) {
      toast.error('Invalid YouTube URL. Please provide a valid link.');
      return false;
    }
    
    return true;
  };

 const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateVideo(file);
      if (validation.isValid) {
        setVideoFile(file);
        setExistingVideoUrl(null);
        return { success: true, message: 'Video selected successfully!' };
      } else {
        return { success: false, message: validation.message };
      }
    }
    return { success: false, message: 'No file selected' };
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    toast.info('Video removed!');
  };

  const resetVideo = () => {
    setVideoFile(null);
    setExistingVideoUrl(null);
  };

  const setExistingVideo = (url) => {
    setExistingVideoUrl(url);
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const handleVideoError = (e) => {
    e.target.src = '/placeholder-video.mp4';
  };

  return {
    videoFile,
    existingVideoUrl,
    validateVideo,
    validateYoutubeLink,
    handleVideoUpload,
    handleVideoRemove,
    resetVideo,
    setExistingVideo,
    getYoutubeEmbedUrl,
    handleVideoError,
    maxVideoSize: maxSize,
    allowedVideoTypes: allowedTypes,
  };
};