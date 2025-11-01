export const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return match && match[2].length === 11 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : null;
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const createFormDataWithDefaults = (fields, homePageData, defaults = {}) => {
  const formData = new FormData();
  
  // Add specific fields
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  // Add preserved fields
  Object.entries(defaults).forEach(([key, value]) => {
    if (!fields.hasOwnProperty(key)) {
      formData.append(key, homePageData?.[key] || value);
    }
  });
  
  return formData;
};

export const handleImageError = (e, fallbackSrc = "/placeholder-image.jpg") => {
  e.target.src = fallbackSrc;
};

export const handleVideoError = (e, fallbackSrc = "/placeholder-video.mp4") => {
  e.target.src = fallbackSrc;
};

// REMOVE the duplicate validateRequired from here