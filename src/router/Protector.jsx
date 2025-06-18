import { Navigate, useLocation } from "react-router";
import { ContextData } from "../utility/ContextData";
import { useContext } from "react";
import Loader from "@/components/custom/Loader";
import { useUser } from "@/hooks/useUser";

const Protector = ({ children }) => {
  const { user, loading } = useContext(ContextData);
  const location = useLocation();
  const { data, isLoading, error } = useUser(user?.email);

  // Show loading spinner during auth or user fetch
  if (loading ) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Redirect to login if user is not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict access to /users if not admin
  if (location.pathname === "/users" && data?.role !== "admin") {
      if (loading || isLoading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }
 return <Navigate to="/" state={{ from: location }} replace />;
  }

  // All good, render children
  return <>{children}</>;
};

export default Protector;
