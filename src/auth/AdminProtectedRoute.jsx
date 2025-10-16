import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingFallback from "@/components/common/LoadingFallback";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      navigate("/superadmin-login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return <LoadingFallback />;
  return <>{children}</>;
};

export default AdminProtectedRoute;