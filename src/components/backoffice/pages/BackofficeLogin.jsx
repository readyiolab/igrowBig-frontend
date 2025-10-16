import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import useTenantApi from "@/hooks/useTenantApi";
import { setCredentials } from "@/store/slices/authSlice";

const BackofficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, loading, error: apiError } = useTenantApi();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      const loginData = { email, password };
      const response = await post("/users/login", loginData);

      if (!response?.token || !response?.user?.tenant_id) {
        throw new Error("Invalid response from server: Missing token or tenant_id");
      }

      // Store credentials in Redux AND localStorage
      dispatch(setCredentials({
        token: response.token,
        tenantId: response.user.tenant_id,
        user: response.user
      }));

      navigate("/backoffice/dashboard");
    } catch (err) {
      console.log("Login Error:", err);
      const errorMsg = err.message || "Unknown error";
      const errorCode = err.error || "UNKNOWN_ERROR";

      switch (errorCode) {
        case "MISSING_FIELDS":
          setErrors({ general: "Email and password are required" });
          break;
        case "EMAIL_NOT_FOUND":
          setErrors({ email: "No account found with this email" });
          break;
        case "INVALID_PASSWORD":
          setErrors({ password: "Incorrect password" });
          break;
        case "ACCOUNT_INACTIVE":
          setErrors({ general: "Your account is inactive. Please contact support to activate your account." });
          break;
        case "SERVER_ERROR":
          setErrors({ general: "Internal Server Error. Please try again later." });
          break;
        default:
          setErrors({ general: errorMsg || "Login failed. Please try again." });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
          alt="Backoffice Background"
          className="object-cover w-full h-full opacity-70 transform scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Backoffice Hub</h1>
          <p className="text-xl font-light">Streamline Your Business Operations</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
            Backoffice Login
          </h2>

          {errors.general && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={loading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className={errors.password ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Forgot password?{" "}
            <Link to="/forgot-password" className="text-black hover:underline font-medium">
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackofficeLogin;