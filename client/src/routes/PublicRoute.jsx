import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // Wait until auth check finishes
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // Already logged in
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;