import { useContext } from "react";
import { ContextData } from "../../context/AuthContext";


const useAuth = () => {
  const auth = useContext(ContextData);
  return auth;
};

export default useAuth;