// ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;