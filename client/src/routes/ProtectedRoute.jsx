import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // Wait until auth check finishes
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
};

export default ProtectedRoute;