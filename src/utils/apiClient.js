// src/utils/apiClient.js
import axios from "axios";
import config from "@/lib/config";
import store from "@/store";
import { logout } from "@/store/slices/authSlice";

const BASE_URL = config.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor for handling auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url
      ? error.config.url.includes("/admin/login") ||
        error.config.url.includes("/users/login") ||
        error.config.url.includes("/users/signup")
      : false;

    if (isLoginRequest) return Promise.reject(error);

    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const redirectPath = isAdminRoute ? "/superadmin-login" : "/backoffice-login";

    // Check for 401/403 errors or token expiration
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      (error.response?.data?.error === "INVALID_TOKEN" ||
       error.response?.data?.error === "AUTH_REQUIRED" ||
       error.response?.data?.message === "No authentication token found" ||
       error.response?.data?.message === "Admin privileges required" ||
       error.response?.data?.message?.includes("expired") ||
       error.response?.data?.message?.includes("Invalid"))
    ) {
      console.log("Token expired or unauthorized, logging out and redirecting to:", redirectPath);
      
      // Dispatch logout action to Redux store
      store.dispatch(logout());
      
      // Redirect to login
      window.location.href = `${window.location.origin}${redirectPath}`;
    }

    return Promise.reject(error);
  }
);

export const apiRequest = async (method, endpoint, payload = null, isFormData = false, config = {}) => {
  const state = store.getState();
  const token = state.auth.token || localStorage.getItem("token");
  
  const publicEndpoints = [
    "/users/signup",
    "/users/login",
    "/admin/login",
    "/site/by-domain",
    "/site/",
  ];

  const headers = {};
  
  if (token && !endpoint.startsWith("/site/")) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  headers["X-Tenant-Domain"] = window.location.hostname;
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const requestConfig = {
    method,
    url: endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`,
    headers,
    data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
    ...config,
  };

  console.log(`API Request: ${method} ${requestConfig.url}`, {
    hostname: window.location.hostname,
    payload,
  });
  
  const response = await apiClient(requestConfig);
  console.log(`API Response: ${method} ${requestConfig.url}`, response.data);

  return response.data;
};