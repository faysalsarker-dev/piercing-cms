import { Navigate, useLocation } from "react-router";




import { ContextData } from "../utility/ContextData";
import { useContext } from "react";
import Loader from "@/components/custom/Loader";

const Protector = ({ children }) => {
 const { user ,loading } = useContext(ContextData);
  const location = useLocation();

 
  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
<Loader/>
      </div>
    );
  }

  // Redirect to the login page if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if user is authenticated
  return <>{children}</>;
};


export default Protector;

