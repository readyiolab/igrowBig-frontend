import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from "@/utils/apiClient";
import LoadingFallback from "@/components/common/LoadingFallback";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { selectToken, selectTenantId } from "@/store/slices/authSlice";

const BackofficeProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const tenantId = useSelector(selectTenantId);
  
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      // No token or tenantId - redirect immediately
      if (!token || !tenantId) {
        console.log("No token or tenant ID found, logging out");
        dispatch(logout());
        navigate("/backoffice-login", { replace: true });
        return;
      }

      try {
        // Validate token by fetching user data
        const userData = await apiRequest("GET", `/users/${tenantId}`);
        
        // Update Redux store with user data
        dispatch(setCredentials({
          token,
          tenantId,
          user: userData
        }));
        
        setIsAuthenticated(true);
        setIsValidating(false);
      } catch (err) {
        // Token expired, invalid, or unauthorized
        // The apiClient interceptor will handle the redirect automatically
        console.log("Authentication validation failed:", err);
        dispatch(logout());
        setIsValidating(false);
        setIsAuthenticated(false);
      }
    };

    validateAuth();
  }, [token, tenantId, navigate, dispatch]);

  // Show loading while validating
  if (isValidating) {
    return <LoadingFallback />;
  }

  // If not authenticated, show nothing (interceptor will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default BackofficeProtectedRoute;