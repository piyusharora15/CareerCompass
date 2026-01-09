import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token, isAuthReady } = useContext(AuthContext);

  if (!isAuthReady) return null; // Or a loading spinner

  return token ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoute;