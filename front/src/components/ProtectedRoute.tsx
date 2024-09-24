import { ReactNode, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { refreshToken } from "../utils/helpers";
import { ACCESS_TOKEN } from "../constants";

type ProtectedRouteProps = {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(null);

  useEffect(() => {
    authenticate().catch(() => {
      setIsAuthorized(false);
    });
  }, []);

  const refreshAccessToken = async () => {
    try {
      let ejectInterceptor = true;
      const accessToken = await refreshToken(ejectInterceptor);
      if(accessToken) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        setIsAuthorized(true);
      }
    } catch(err) {
      setIsAuthorized(false);
    }
  }

  const authenticate = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000 // to seconds
    if(tokenExpiration! < now) {
      await refreshAccessToken();
    } else {
      setIsAuthorized(true);
    }
  }

  if(isAuthorized == null) {
    return <div>Loading...</div>
  }
  return isAuthorized ? children : <Navigate to="/auth/login"/>
}   

export default ProtectedRoute;