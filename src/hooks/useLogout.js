// src/hooks/useLogout.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());
    
    // Navigate to login
    navigate("/backoffice-login", { replace: true });
    
    console.log("User logged out successfully");
  };

  return handleLogout;
};

export default useLogout;

// Usage example in any component:
// import useLogout from "@/hooks/useLogout";
// 
// const MyComponent = () => {
//   const logout = useLogout();
//   
//   return (
//     <Button onClick={logout}>Logout</Button>
//   );
// };