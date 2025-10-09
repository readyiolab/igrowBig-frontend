// src/lib/config.js
const API_BASE_URL = window.location.origin.includes("localhost")
  ? "https://igrowbig.com/api"
  : `${window.location.origin}/api`;

export default {
  API_BASE_URL,
};
