

// import { useState, useCallback } from 'react';
// import axios from 'axios';

// // const getBaseUrl = () => {
// //   const protocol = window.location.protocol; // http: or https:
// //   const hostname = window.location.hostname;
// //   let domain = 'begrat.com';

// //   // Subdomain or custom domain
// //   if (hostname !== 'begrat.com' && hostname !== 'www.begrat.com' && !hostname.includes('localhost')) {
// //     domain = hostname; // e.g., priti.begrat.com or mydomain.com
// //   } else if (hostname === 'stage.begrat.com') {
// //     domain = 'stage.begrat.com';
// //   } else if (hostname.includes('localhost')) {
// //     return 'http://localhost:3001/api';
// //   }

// //   return `${protocol}//${domain}/api`;
// // };
// const getBaseUrl = () => {
//   const protocol = window.location.protocol; // http:
//   const hostname = window.location.hostname;

//   if (hostname.includes("localhost")) {
//     return "http://localhost:3001/api"; // Direct backend for local dev
//   }

//   return `${protocol}//${hostname}/api`; // e.g., http://begrat.com/api, http://stage.begrat.com/api, http://alokshope.com/api
// };
// const BASE_URL = getBaseUrl();

// const apiClient = axios.create({
//   baseURL: BASE_URL,
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isLoginRequest =
//       error.config.url.includes('/admin/login') ||
//       error.config.url.includes('/users/login') ||
//       error.config.url.includes('/users/signup');

//     if (isLoginRequest) {
//       return Promise.reject(error);
//     }

//     const isAdminRoute = window.location.pathname.startsWith('/admin');
//     const redirectPath = isAdminRoute ? '/superadmin-login' : '/backoffice-login';

//     if (
//       error.response?.status === 401 &&
//       (error.response?.data?.message === 'No authentication token found' ||
//         error.response?.data?.message === 'Admin privileges required' ||
//         error.response?.data?.message?.includes('expired'))
//     ) {
//       console.log('Token expired or unauthorized, redirecting to:', redirectPath);
//       localStorage.clear();
//       window.location.href = `${window.location.protocol}//${window.location.hostname}${redirectPath}`;
//     }

//     return Promise.reject(error);
//   }
// );

// const useTenantApi = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const getToken = () => localStorage.getItem('token');

//   const apiRequest = useCallback(
//     async (method, endpoint, payload = null, isFormData = false) => {
//       setLoading(true);
//       setError(null);

//       const publicEndpoints = ['/users/signup', '/users/login', '/admin/login'];

//       const token = getToken();

//       if (!token && !publicEndpoints.includes(endpoint) && !endpoint.startsWith('/site/')) {
//         const authError = { message: 'No authentication token found' };
//         setError(authError);
//         setLoading(false);
//         return Promise.reject(authError);
//       }

//       try {
//         const headers = {};
//         if (token && !endpoint.startsWith('/site/')) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         if (!isFormData) {
//           headers['Content-Type'] = 'application/json';
//         }

//         const config = {
//           method,
//           url: endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`,
//           headers,
//           data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
//         };

//         console.log(`API Request: ${method} ${endpoint}`, payload);
//         const response = await apiClient(config);
//         console.log(`API Response: ${method} ${endpoint}`, response.data);

//         setData(response.data);
//         return response.data;
//       } catch (err) {
//         const errorData = err.response?.data || {
//           message: 'API request failed',
//           details: err.message,
//         };
//         console.error(`API Error: ${method} ${endpoint}`, errorData);
//         setError(errorData);
//         return Promise.reject(errorData);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const getAll = useCallback((endpoint) => apiRequest('get', endpoint), [apiRequest]);
//   const post = useCallback(
//     (endpoint, data, isFormData = false) => apiRequest('post', endpoint, data, isFormData),
//     [apiRequest]
//   );
//   const put = useCallback(
//     (endpoint, data, isFormData = false) => apiRequest('put', endpoint, data, isFormData),
//     [apiRequest]
//   );
//   const del = useCallback((endpoint) => apiRequest('delete', endpoint), [apiRequest]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return { data, loading, error, getAll, post, put, del, apiRequest, clearError };
// };

// export default useTenantApi;

import { useState, useCallback } from "react";
import axios from "axios";

const getBaseUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  if (hostname.includes("localhost")) {
    return "http://localhost:3001/api";
  }

  return `${protocol}//${hostname}/api`;
};

const BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url
      ? error.config.url.includes("/admin/login") ||
        error.config.url.includes("/users/login") ||
        error.config.url.includes("/users/signup")
      : false;

    if (isLoginRequest) {
      return Promise.reject(error);
    }

    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const redirectPath = isAdminRoute ? "/superadmin-login" : "/backoffice-login";

    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "No authentication token found" ||
        error.response?.data?.message === "Admin privileges required" ||
        error.response?.data?.message?.includes("expired"))
    ) {
      console.log("Token expired or unauthorized, redirecting to:", redirectPath);
      localStorage.clear();
      window.location.href = `${window.location.protocol}//${window.location.hostname}${redirectPath}`;
    }

    return Promise.reject(error);
  }
);

const useTenantApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const apiRequest = useCallback(
    async (method, endpoint, payload = null, isFormData = false) => {
      setLoading(true);
      setError(null);

      const publicEndpoints = [
        "/users/signup",
        "/users/login",
        "/admin/login",
        "/site/by-domain",
        "/site/",
      ];

      const token = getToken();

      if (
        !token &&
        !publicEndpoints.some((publicEndpoint) => endpoint.startsWith(publicEndpoint))
      ) {
        const authError = { message: "No authentication token found" };
        setError(authError);
        setLoading(false);
        return Promise.reject(authError);
      }

      let config;
      try {
        const headers = {};
        if (token && !endpoint.startsWith("/site/")) {
          headers.Authorization = `Bearer ${token}`;
        }
        if (!isFormData) {
          headers["Content-Type"] = "application/json";
        }

        config = {
          method,
          url: endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`,
          headers,
          data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
        };

        console.log(`API Request: ${method} ${config.url}`, payload);
        const response = await apiClient(config);
        console.log(`API Response: ${method} ${config.url}`, response.data);

        setData(response.data);
        return response.data;
      } catch (err) {
        const errorData = err.response?.data || {
          message: "API request failed",
          details: err.message,
        };
        console.error(`API Error: ${method} ${config ? config.url : endpoint}`, errorData);
        setError(errorData);
        return Promise.reject(errorData);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAll = useCallback((endpoint) => apiRequest("get", endpoint), [apiRequest]);
  const post = useCallback(
    (endpoint, data, isFormData = false) => apiRequest("post", endpoint, data, isFormData),
    [apiRequest]
  );
  const put = useCallback(
    (endpoint, data, isFormData = false) => apiRequest("put", endpoint, data, isFormData),
    [apiRequest]
  );
  const del = useCallback((endpoint) => apiRequest("delete", endpoint), [apiRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { data, loading, error, getAll, post, put, del, apiRequest, clearError };
};

export default useTenantApi;