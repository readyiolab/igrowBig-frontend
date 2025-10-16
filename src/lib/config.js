// src/lib/config.js

/**
 * Get API base URL - should always point to your backend server
 * NOT the current domain (which could be a custom domain)
 */
const getApiBaseUrl = () => {
  // Development: use localhost backend
  if (window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1") {
    return import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  }

  // Production: ALWAYS use your main API domain
  // This is where your Node.js backend is actually running
  return import.meta.env.VITE_API_URL || "https://igrowbig.com/api";
};

const config = {
  API_BASE_URL: getApiBaseUrl(),
  BASE_DOMAIN: import.meta.env.VITE_BASE_DOMAIN || "igrowbig.com",
};

console.log("🔧 Config loaded:", config);

export default config;